import { useState } from 'react';
import api from '../services/api'; 
// import { useNavigate } from 'react-router-dom'; // Descomente se quiser navegar

/**
 * Página para o condutor criar (partilhar) uma nova viagem.
 * (Versão com Layout Corrigido)
 */
function ShareForm() {
  // Estados para controlar todos os campos do formulário
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [spots, setSpots] = useState(1); 
  const [message, setMessage] = useState('');

  // Estados para feedback (retorno ao usuário)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // const navigate = useNavigate();

  // --- Estilos CSS-in-JS (Padrão das nossas páginas) ---
  const styles = {
    pageContainer: {
      padding: '20px',
      maxWidth: '600px', // Um pouco mais largo para este formulário
      margin: '40px auto',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
    },
    input: {
      width: '100%',
      padding: '10px',
      boxSizing: 'border-box',
      borderRadius: '4px',
      border: '1px solid #ccc'
    },
    textarea: {
      width: '100%',
      padding: '10px',
      boxSizing: 'border-box',
      borderRadius: '4px',
      border: '1px solid #ccc',
      minHeight: '80px',
      fontFamily: 'inherit' // Garante que a fonte é a mesma
    },
    // [NOVO] Estilo para a linha com Data, Hora, Lugares
    rowGroup: {
      display: 'flex',
      flexDirection: 'row',
      gap: '10px',
      flexWrap: 'wrap' // Permite quebrar em ecrãs muito pequenos
    },
    // [NOVO] Estilo para os itens dentro da linha
    flexInputGroup: {
      flex: 1, // Faz com que ocupem espaço igual
      minWidth: '120px' // Largura mínima antes de quebrar a linha
    },
    button: {
      padding: '12px 15px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold'
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    },
    errorMsg: {
      color: 'red',
      fontWeight: 'bold'
    },
    successMsg: {
      color: 'green',
      fontWeight: 'bold'
    }
  };
  // --- Fim dos Estilos ---

  /**
   * Função chamada quando o formulário é enviado
   */
  const handleShareSubmit = async (e) => {
    e.preventDefault(); 
    setError('');
    setSuccess('');
    setLoading(true);

    if (!from || !to || !departureDate || !departureTime || spots <= 0) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/create-trip', {
        from,
        to,
        departureDate,
        departureTime,
        spots: String(spots),
        message,
      });

      setSuccess('Viagem criada com sucesso!');
      
      // Limpar o formulário
      setFrom('');
      setTo('');
      setDepartureDate('');
      setDepartureTime('');
      setSpots(1);
      setMessage('');
      
      // navigate('/viagens'); // Opcional: navegar para a página de viagens

    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError('Não autorizado. Por favor, faça login novamente.');
        // navigate('/login');
      } else {
        setError('Ocorreu um erro ao criar a viagem.');
      }
      console.error("Falha ao criar viagem:", err);
    } finally {
      setLoading(false);
    }
  };

  // 5. O JSX (HTML) agora usa os estilos
  return (
    <div style={styles.pageContainer}>
      <h2>Oferecer Carona</h2>
      
      <form onSubmit={handleShareSubmit} style={styles.form}>
        
        {error && <p style={styles.errorMsg}>{error}</p>}
        {success && <p style={styles.successMsg}>{success}</p>}

        <div style={styles.inputGroup}>
          <label htmlFor="from">De (Origem):*</label>
          <input id="from" type="text" value={from} onChange={(e) => setFrom(e.target.value)} required style={styles.input} />
        </div>
        
        <div style={styles.inputGroup}>
          <label htmlFor="to">Para (Destino):*</label>
          <input id="to" type="text" value={to} onChange={(e) => setTo(e.target.value)} required style={styles.input} />
        </div>

        {/* A linha com 3 campos */}
        <div style={styles.rowGroup}>
          <div style={{ ...styles.inputGroup, ...styles.flexInputGroup }}>
            <label htmlFor="date">Data:*</label>
            <input id="date" type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required style={styles.input} />
          </div>
          <div style={{ ...styles.inputGroup, ...styles.flexInputGroup }}>
            <label htmlFor="time">Hora:*</label>
            <input id="time" type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} required style={styles.input} />
          </div>
          <div style={{ ...styles.inputGroup, ...styles.flexInputGroup }}>
            <label htmlFor="spots">Lugares:*</label>
            <input id="spots" type="number" min="1" value={spots} onChange={(e) => setSpots(Number(e.target.value))} required style={styles.input} />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="message">Mensagem (opcional):</label>
          <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} style={styles.textarea}></textarea>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
        >
          {loading ? 'Publicando...' : 'Publicar Viagem'}
        </button>
      </form>
    </div>
  );
}

export default ShareForm;