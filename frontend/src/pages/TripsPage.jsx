import React, { useState, useEffect } from 'react';
// 1. Importamos o nosso 'api' (para fazer pedidos autenticados)
import api from '../services/api';
// (Opcional: para navegar se houver erro)
// import { useNavigate } from 'react-router-dom'; 

/**
 * Página para o utilizador ver as suas viagens.
 * Mostra as viagens que está a conduzir E os pedidos que fez.
 */
function TripsPage() {
  // 2. Estados para guardar os dados vindos do backend
  const [drivingTrips, setDrivingTrips] = useState([]); // Viagens que eu conduzo
  const [ridingRequests, setRidingRequests] = useState([]); // Viagens que eu pedi
  
  // Estados para controlo do ecrã
  const [loading, setLoading] = useState(true); // Começa a carregar
  const [error, setError] = useState('');

  // const navigate = useNavigate();

  // 3. [CRUCIAL] useEffect para ir buscar os dados
  // Isto corre UMA VEZ, assim que o componente é montado no ecrã.
  useEffect(() => {
    // Função 'async' para podermos usar 'await'
    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError('');

        // 4. FAZER OS PEDIDOS (autenticados automaticamente pelo api.js)
        
        // Pedido 1: Buscar as viagens que eu estou a conduzir
        const drivingResponse = await api.get('/trips/driving');
        setDrivingTrips(drivingResponse.data); // Guarda no estado

        // Pedido 2: Buscar os pedidos que eu fiz para viagens de outros
        const ridingResponse = await api.get('/trips/riding');
        setRidingRequests(ridingResponse.data); // Guarda no estado

      } catch (err) {
        // Se o token for inválido/expirado, o backend dá 401 ou 403
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError('Sessão expirada. Por favor, faça login novamente.');
          // navigate('/login'); // Redireciona para o login
        } else {
          setError('Não foi possível carregar as viagens.');
        }
        console.error("Erro a buscar viagens:", err);
      } finally {
        // 5. Independentemente de sucesso ou erro, paramos o 'loading'
        setLoading(false);
      }
    };

    fetchTrips(); // Chama a função que acabámos de definir
  }, []); // O array vazio [] significa "correr isto apenas uma vez"

  // 6. RENDERIZAÇÃO
  
  // Se estiver a carregar, mostra uma mensagem
  if (loading) {
    return <div style={{ padding: '20px' }}>A carregar viagens...</div>;
  }

  // Se deu erro, mostra o erro
  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  }

  // Se tudo correu bem, mostra os dados
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2>Minhas Viagens (TripsPage)</h2>

      {/* Secção 1: Viagens que eu conduzo */}
      <section>
        <h3>Viagens que estou a oferecer</h3>
        {drivingTrips.length === 0 ? (
          <p>Ainda não publicou nenhuma viagem.</p>
        ) : (
          drivingTrips.map((trip) => (
            <div key={trip.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <h4>De: {trip.origin} <br/> Para: {trip.destination}</h4>
              <p>Data: {new Date(trip.departureTime).toLocaleString()}</p>
              <p>Lugares restantes: {trip.spots}</p>
              
              {/* Mostrar pedidos para esta viagem */}
              <h5>Pedidos recebidos ({trip.requests.length}):</h5>
              {trip.requests.length > 0 ? (
                trip.requests.map((req) => (
                  <div key={req.id} style={{ paddingLeft: '20px', fontSize: '0.9em' }}>
                    <p>
                      Passageiro: {req.user.firstName} {req.user.lastName} <br/>
                      Estado: <strong>{req.status}</strong>
                    </p>
                    {/* TO-DO: Adicionar botões de Aprovar/Recusar aqui */}
                  </div>
                ))
              ) : (
                <p style={{ paddingLeft: '20px', fontSize: '0.9em' }}>Nenhum pedido ainda.</p>
              )}
            </div>
          ))
        )}
      </section>

      <hr style={{ margin: '30px 0' }} />

      {/* Secção 2: Viagens que eu vou apanhar */}
      <section>
        <h3>Viagens que pedi</h3>
        {ridingRequests.length === 0 ? (
          <p>Ainda não pediu nenhuma viagem.</p>
        ) : (
          ridingRequests.map((request) => (
            <div key={request.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
              <h4>De: {request.share.origin} <br/> Para: {request.share.destination}</h4>
              <p>Data: {new Date(request.share.departureTime).toLocaleString()}</p>
              <p>Meu estado: <strong>{request.status}</strong></p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default TripsPage;