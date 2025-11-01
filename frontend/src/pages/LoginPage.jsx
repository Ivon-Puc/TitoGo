import { useState } from 'react';
import api from '../services/api'; 
import { useNavigate } from 'react-router-dom'; 
// 1. [NOVO] Importar o nosso hook 'useAuth'
import { useAuth } from '../context/AuthContext';

/**
 * Página de Login - Atualizada para usar o AuthContext
 */
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // 2. [NOVO] Pegar a função 'login' do nosso contexto
  const { login } = useAuth(); 

  // --- Os Estilos (styles) permanecem exatamente os mesmos ---
  const styles = {
    pageContainer: {
      padding: '20px',
      maxWidth: '400px',
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/login', {
        email: email,
        password: password,
      });

      const token = response.data.token;

      // 3. [A GRANDE MUDANÇA]
      // Em vez de mexer no localStorage e no axios aqui...
      // localStorage.setItem('token', token);
      // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // ...nós apenas chamamos a nossa função 'login' centralizada!
      login(token); 

      // A função 'login' (dentro do AuthContext) vai fazer tudo isso
      // e, o mais importante, vai ATUALIZAR O ESTADO GLOBAL.

      // 4. Redirecionamos o utilizador
      navigate('/'); // Ou '/viagens'

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Ocorreu um erro. Tente novamente.');
      }
      console.error("Falha no login:", err);
    } finally {
      setLoading(false);
    }
  };

  // O JSX (HTML) permanece exatamente o mesmo
  return (
    <div style={styles.pageContainer}>
      <h2>Login - TitoGo</h2>
      
      <form onSubmit={handleLogin} style={styles.form}>
        
        {error && <p style={styles.errorMsg}>{error}</p>}

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