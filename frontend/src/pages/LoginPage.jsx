import React, { useState } from 'react';
// 1. [Importante] Importamos nossa 'api' que criamos.
// Ajuste o caminho '../services/api' se seu arquivo estiver em outro local.
import api from '../services/api'; 

// (Se estiver a usar react-router-dom para navegar, importe o useHistory ou useNavigate)
// import { useNavigate } from 'react-router-dom';

/**
 * Página de Login
 */
function LoginPage() {
  // Estados para guardar o que o usuário digita
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estado para mostrar mensagens de erro do backend
  const [error, setError] = useState('');

  // (Se usar react-router, ative isto)
  // const navigate = useNavigate();

  /**
   * Função chamada quando o formulário é enviado
   */
  const handleLogin = async (e) => {
    // 1. Previne o recarregamento da página
    e.preventDefault();
    setError(''); // Limpa erros anteriores

    try {
      // 2. [A MÁGICA ACONTECE AQUI]
      // Usamos o 'api.post' para enviar os dados para http://localhost:5000/login
      const response = await api.post('/login', {
        email: email,       // Vem do nosso estado 'email'
        password: password  // Vem do nosso estado 'password'
      });

      // 3. SUCESSO! O backend respondeu com 200 OK.
      // O 'response.data' contém o JSON que o backend enviou: { message: '...', token: '...' }
      const token = response.data.token;

      // 4. [CRUCIAL] Guardamos o token no localStorage do navegador.
      // É daqui que o nosso 'intercetor' (em api.js) o vai ler da próxima vez!
      localStorage.setItem('token', token);

      // 5. [BÓNUS] Atualizamos o 'header' padrão do axios para pedidos futuros NA SESSÃO ATUAL.
      // Isto garante que o *próximo* pedido que fizermos (daqui a 1 segundo) já terá o token,
      // mesmo antes de o intercetor correr (é uma segurança extra).
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 6. Informa o utilizador e redireciona-o
      alert('Login bem-sucedido! Seu token está salvo.');
      
      // (Se usar react-router, descomente a linha abaixo para navegar)
      // navigate('/dashboard'); // ou '/procurar-viagem'

    } catch (err) {
      // 7. FALHA. O backend enviou um erro (400, 401, 500).
      // err.response.data contém a mensagem de erro do backend (ex: "Invalid email or password")
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Ocorreu um erro. Tente novamente.');
      }
      console.error("Erro no login:", err);
    }
  };

  // 8. O formulário JSX
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login - TitoGo</h2>
      
      {/* O 'onSubmit' chama a nossa função handleLogin */}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Senha:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        {/* Mostra a mensagem de erro, se existir */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" style={{ padding: '10px 15px' }}>
          Entrar
        </button>
      </form>
    </div>
  );
}

export default LoginPage;