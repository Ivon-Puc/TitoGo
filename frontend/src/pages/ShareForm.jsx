import React, { useState } from 'react';
// 1. Importamos o nosso 'api' (que já sabe a URL base e como adicionar o token)
// O caminho '../services/api' está correto porque estamos em 'src/pages/'
import api from '../services/api'; 

/**
 * Página para o condutor criar (partilhar) uma nova viagem.
 * (Este é o seu ShareForm.jsx atualizado para usar o serviço 'api')
 */
function ShareForm() {
  // Estados para controlar todos os campos do formulário
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [spots, setSpots] = useState(1); // Começa com 1 lugar por defeito
  const [message, setMessage] = useState('');

  // Estados para retorno ao usuário
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /**
   * Função chamada quando o formulário é enviado
   */
  const handleShareSubmit = async (e) => {
    e.preventDefault(); // Previne o reload da página
    setError('');
    setSuccess('');

    // Validação simples
    if (!from || !to || !departureDate || !departureTime || spots <= 0) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      // 2. [A MÁGICA ACONTECE AQUI]
      // Apenas chamamos 'api.post' para a rota protegida.
      // O 'api.js' vai automaticamente buscar o 'token' ao localStorage
      // e colocá-lo no cabeçalho 'Authorization: Bearer ...'
      const response = await api.post('/create-trip', {
        from, // forma curta de: from: from
        to,
        departureDate,
        departureTime,
        spots: String(spots), // O backend espera 'spots' como string
        message,
      });

      // 3. SUCESSO! O backend (com o token válido) criou a viagem
      setSuccess('Viagem criada com sucesso!');
      
      // Limpar o formulário (opcional)
      setFrom('');
      setTo('');
      setDepartureDate('');
      setDepartureTime('');
      setSpots(1);
      setMessage('');

      // Aqui, você poderia navegar o utilizador para a página "Minhas Viagens"
      // navigate('/minhas-viagens');

    } catch (err) {
      // 4. FALHA. O backend deu um erro.
      // Se for 401 ou 403, significa que o token era inválido ou expirou.
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError('Não autorizado. Por favor, faça login novamente.');
        // Aqui você deveria redirecionar para a página de login
        // navigate('/login');
      } else {
        // Outros erros (ex: erro de servidor)
        setError('Ocorreu um erro ao criar a viagem.');
      }
      console.error("Falha ao criar viagem:", err);
    }
  };

  // 5. O formulário JSX
  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h2>Oferecer Carona</h2>
      
      <form onSubmit={handleShareSubmit}>
        {/* Mostra mensagens de sucesso ou erro */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        {/* Campos do formulário */}
        <div style={{ marginBottom: '10px' }}>
          De (Origem):*<br />
          <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          Para (Destino):*<br />
          <input type="text" value={to} onChange={(e) => setTo(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            Data:*<br />
            <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required style={{ width: '100%' }} />
          </div>
          <div style={{ flex: 1 }}>
            Hora:*<br />
            <input type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} required style={{ width: '100%' }} />
          </div>
          <div style={{ flex: 1 }}>
            Lugares:*<br />
            <input type="number" min="1" value={spots} onChange={(e) => setSpots(Number(e.target.value))} required style={{ width: '100%' }} />
          </div>
        </div>
        <div style={{ marginBottom: '10px' }}>
          Mensagem (opcional):<br />
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} style={{ width: '100%' }} rows="3"></textarea>
        </div>
        
        <button type="submit" style={{ padding: '10px 15px' }}>
          Publicar Viagem
        </button>
      </form>
    </div>
  );
}

export default ShareForm;