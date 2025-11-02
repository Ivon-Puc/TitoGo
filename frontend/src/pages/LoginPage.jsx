import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation ADICIONADO
import api from '../services/api'; 
import toast from 'react-hot-toast'; 
import { useAuth } from '../context/AuthContext'; // Importar o contexto

/**
 * Página de Login - Versão com Layout Melhorado e Navegação Corrigida
 */
function LoginPage() {
  // Estados para o formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados de feedback
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hooks do React Router e do Contexto
  const navigate = useNavigate();
  const location = useLocation(); // [CRUCIAL] Para ler a rota de destino guardada
  const { login } = useAuth(); 

  // --- Estilos CSS-in-JS (Consistentes com a RegisterPage) ---
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

  /**
   * Função chamada quando o formulário de login é submetido
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/login', {
        email: email,
        password: password,
      });

      // 1. SUCESSO! Guardamos o token no contexto
      const token = response.data.token;
      login(token); 
      
      toast.success("Login bem-sucedido! Sincronizando com a aplicação...");

      // 2. [CORREÇÃO DE NAVEGAÇÃO] Redirecionar para a rota de destino guardada
      // O 'location.state?.from?.pathname' lê a rota guardada pelo ProtectedRoute
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true }); 

    } catch (err) {
      // 3. FALHA
      if (err.response && err.response.data) {
        // Usa a mensagem devolvida pelo Backend (ex: "Usuário não aprovado")
        setError(err.response.data.message || 'Erro no login. Credenciais inválidas.');
      } else {
        setError('Ocorreu um erro. Verifique sua conexão com a API.');
      }
      console.error("Falha no login:", err);
    } finally {
      // 4. Paramos o loading
      setLoading(false);
    }
  };

  // 5. O JSX (HTML)
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