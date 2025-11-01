import { useState, useEffect } from 'react';
import api from '../services/api'; 
// import { useNavigate } from 'react-router-dom'; // Descomente se precisar

/**
 * Página para o utilizador ver as suas viagens.
 * (Versão com Layout Corrigido)
 */
function TripsPage() {
  // Estados para guardar os dados vindos do backend
  const [drivingTrips, setDrivingTrips] = useState([]); // Viagens que eu conduzo
  const [ridingRequests, setRidingRequests] = useState([]); // Viagens que eu pedi
  
  // Estados para controlo do ecrã
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');

  // const navigate = useNavigate();

  // --- [NOVO] Estilos CSS-in-JS (Padrão das nossas páginas) ---
  const styles = {
    pageContainer: {
      padding: '20px',
      maxWidth: '800px', // Esta página pode ser mais larga
      margin: '40px auto',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      backgroundColor: '#ffffff'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem'
    },
    subtitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginTop: '1.5rem',
      marginBottom: '1rem',
      borderBottom: '2px solid #eee',
      paddingBottom: '5px'
    },
    tripItem: {
      border: '1px solid #eee',
      padding: '15px',
      marginBottom: '15px',
      borderRadius: '4px',
      backgroundColor: '#f9f9f9'
    },
    tripDetails: {
      fontSize: '0.95rem',
      lineHeight: '1.6'
    },
    requestItem: {
      borderTop: '1px dashed #ccc',
      marginTop: '10px',
      paddingTop: '10px',
      marginLeft: '15px'
    },
    loadingText: {
      padding: '20px',
      fontSize: '1.2rem',
      textAlign: 'center'
    },
    errorMsg: {
      padding: '20px',
      color: 'red',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    // Botões de Aprovar/Recusar (Vamos adicionar a lógica mais tarde)
    approveButton: {
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '5px'
    },
    declineButton: {
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '4px',
      cursor: 'pointer'
    }
  };
  // --- Fim dos Estilos ---

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError('');

        // Pedido 1: Buscar as viagens que eu estou a conduzir
        const drivingResponse = await api.get('/trips/driving');
        setDrivingTrips(drivingResponse.data); 

        // Pedido 2: Buscar os pedidos que eu fiz
        const ridingResponse = await api.get('/trips/riding');
        setRidingRequests(ridingResponse.data); 

      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError('Sessão expirada. Por favor, faça login novamente.');
          // navigate('/login'); 
        } else {
          setError('Não foi possível carregar as viagens.');
        }
        console.error("Erro a buscar viagens:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips(); 
  }, []); 

  // Se estiver a carregar...
  if (loading) {
    return <div style={styles.loadingText}>Carregando viagens...</div>;
  }

  // Se deu erro...
  if (error) {
    return <div style={styles.errorMsg}>{error}</div>;
  }

  // Se tudo correu bem, mostra os dados (agora estilizados)
  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.title}>Minhas Viagens</h2>

      {/* Secção 1: Viagens que eu conduzo */}
      <section>
        <h3 style={styles.subtitle}>Viagens que estou oferecendo</h3>
        {drivingTrips.length === 0 ? (
          <p>Ainda não publicou nenhuma viagem.</p>
        ) : (
          drivingTrips.map((trip) => (
            <div key={trip.id} style={styles.tripItem}>
              <div style={styles.tripDetails}>
                <p><strong>De:</strong> {trip.origin}</p>
                <p><strong>Para:</strong> {trip.destination}</p>
                <p><strong>Data:</strong> {new Date(trip.departureTime).toLocaleString('pt-BR')}</p>
                <p><strong>Lugares restantes:</strong> {trip.spots}</p>
              </div>
              
              {/* Mostrar pedidos para esta viagem */}
              <h5 style={{ fontWeight: 'bold', marginTop: '10px' }}>
                Pedidos recebidos ({trip.requests.length}):
              </h5>
              {trip.requests.length > 0 ? (
                trip.requests.map((req) => (
                  <div key={req.id} style={styles.requestItem}>
                    <p>
                      <strong>Passageiro:</strong> {req.user.firstName} {req.user.lastName} <br/>
                      <strong>Estado:</strong> {req.status}
                    </p>
                    {/* [FUNCIONALIDADE FUTURA] Botões de Aprovar/Recusar aqui */}
                    {req.status === 'PENDING' && (
                      <div style={{marginTop: '5px'}}>
                        <button style={styles.approveButton}>Aprovar</button>
                        <button style={styles.declineButton}>Recusar</button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ ...styles.tripDetails, ...styles.requestItem, borderTop: 'none', marginLeft: '0', paddingTop: '5px' }}>
                  Nenhum pedido ainda.
                </p>
              )}
            </div>
          ))
        )}
      </section>

      {/* Secção 2: Viagens que eu vou apanhar */}
      <section>
        <h3 style={styles.subtitle}>Viagens que pedi</h3>
        {ridingRequests.length === 0 ? (
          <p>Ainda não pediu nenhuma viagem.</p>
        ) : (
          ridingRequests.map((request) => (
            <div key={request.id} style={styles.tripItem}>
              <div style={styles.tripDetails}>
                <p><strong>De:</strong> {request.share.origin}</p>
                <p><strong>Para:</strong> {request.share.destination}</p>
                <p><strong>Data:</strong> {new Date(request.share.departureTime).toLocaleString('pt-BR')}</p>
                <p><strong>Meu estado:</strong> {request.status}</p>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default TripsPage;