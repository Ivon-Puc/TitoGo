import React, { useState } from 'react';
import api from '../services/api'; 
// [IMPORTANTE] Precisamos disto para redirecionar o utilizador após o login
import { useNavigate } from 'react-router-dom'; 

/**
 * Página de Login - Versão com Layout Melhorado
 */
function LoginPage() {
  // Estados para o formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados de feedback
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hook do React Router para navegar
  const navigate = useNavigate();

  // --- Estilos CSS-in-JS (Consistentes com a RegisterPage) ---
  const styles = {
    pageContainer: {
      padding: '20px',
      maxWidth: '400px', // Mais estreito para login
      margin: '40px auto',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    form: {
      display: 'flex',
      flexDirection: 'column', // Campos uns em cima dos outros
      gap: '15px' // Espaço entre cada campo
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column', // Label em cima do input
      gap: '5px'
    },
    input: {
      width: '100%',
      padding: '10px',
      boxSizing: 'border-box', // Garante que o padding não quebra o layout
      borderRadius: '4px',
      border: '1px solid #ccc'
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
    }
  };
  // --- Fim dos Estilos ---

  /**
   * Função chamada quando o formulário de login é submetido
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Usamos o 'api.post' (que já sabe a URL do Render)
      const response = await api.post('/login', {
        email: email,
        password: password,
      });

      // 2. SUCESSO! Guardamos o token
      const token = response.data.token;
      localStorage.setItem('token', token);
      
      // Atualizamos o 'header' padrão do axios para pedidos futuros
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 3. [MELHORIA] Redirecionamos o utilizador para a página principal
      navigate('/'); // Ou '/viagens'

    } catch (err) {
      // 4. FALHA
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Ocorreu um erro. Tente novamente.');
      }
      console.error("Falha no login:", err);
    } finally {
      // 5. Paramos o loading
      setLoading(false);
    }
  };

  // 6. O JSX (HTML) agora usa os estilos
  return (
    <div style={styles.pageContainer}>
      <h2>Login - TitoGo</h2>
      
      <form onSubmit={handleLogin} style={styles.form}>
        
        {/* Mostra o erro, se existir */}
        {error && <p style={styles.errorMsg}>{error}</p>}

        {/* Campo de Email */}
        <div style={styles.inputGroup}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            placeholder="seu.email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        
        {/* Campo de Senha */}
        <div style={styles.inputGroup}>
          <label htmlFor="password">Senha:</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        
        {/* Botão de Submissão */}
        <button 
          type="submit" 
          disabled={loading}
          style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
        >
          {loading ? 'A entrar...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;