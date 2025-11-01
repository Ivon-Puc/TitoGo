import React, { useState } from 'react';
import api from '../services/api';
// (Descomente se estiver a usar o react-router-dom para navegar)
// import { useNavigate } from 'react-router-dom';

/**
 * Página de Cadastro (Registro) - Versão com Layout Melhorado
 */
function RegisterPage() {
  // Estados para o formulário
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [driverLicenseId, setDriverLicenseId] = useState('');
  const [gender, setGender] = useState('MALE'); // Valor inicial
  const [senacId, setSenacId] = useState(''); // Campo obrigatório
  
  // Estados de feedback
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Estado de loading

  // const navigate = useNavigate();

  // --- Estilos CSS-in-JS para organizar o layout ---
  // Não é o ideal, mas resolve o problema sem ficheiros CSS
  const styles = {
    pageContainer: {
      padding: '20px',
      maxWidth: '500px',
      margin: '40px auto', // Margem no topo e auto nas laterais
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
    radioGroup: {
      display: 'flex',
      gap: '15px'
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // 1. Ativar o loading
    setLoading(true);

    if (password !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      setLoading(false); // Parar loading
      return;
    }

    try {
      const response = await api.post('/register', {
        firstName,
        lastName,
        email,
        password,
        driverLicenseId,
        gender,
        senacId 
      });

      // 2. SUCESSO!
      setSuccess('Registo bem-sucedido! Pode agora fazer login.');
      setError(''); // Garante que qualquer erro antigo é limpo

      // Limpar o formulário
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setDriverLicenseId('');
      setGender('MALE');
      setSenacId('');
      
      // Redirecionar para o login após 2 segundos
      // setTimeout(() => {
      //   navigate('/login');
      // }, 2000);

    } catch (err) {
      // 3. FALHA
      setSuccess(''); // Garante que qualquer sucesso antigo é limpo
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Ocorreu um erro no registo. Tente novamente.');
      }
      console.error("Erro no registo:", err);
    } finally {
      // 4. Parar o loading, quer dê sucesso ou erro
      setLoading(false);
    }
  };

  // 5. O JSX (HTML) agora usa os estilos que definimos
  return (
    <div style={styles.pageContainer}>
      <h2>Cadastro</h2>
      
      <form onSubmit={handleRegister} style={styles.form}>
        
        {/* Mostra feedback (APENAS UM DE CADA VEZ) */}
        {error && <p style={styles.errorMsg}>{error}</p>}
        {success && <p style={styles.successMsg}>{success}</p>}

        {/* Campos do formulário organizados */}
        <div style={styles.inputGroup}>
          <label htmlFor="firstName">Nome:</label>
          <input id="firstName" type="text" placeholder="Seu nome" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={styles.input} />
        </div>
        
        <div style={styles.inputGroup}>
          <label htmlFor="lastName">Sobrenome:</label>
          <input id="lastName" type="text" placeholder="Seu sobrenome" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="email">E-mail:</label>
          <input id="email" type="email" placeholder="seu.email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="password">Senha:</label>
          <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirme a senha:</label>
          <input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="driverLicenseId">Número da CNH:</label>
          <input id="driverLicenseId" type="text" placeholder="08052847207" value={driverLicenseId} onChange={(e) => setDriverLicenseId(e.target.value)} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="senacId">ID Senac:</label>
          <input id="senacId" type="text" placeholder="seu.id@sp.senac.br" value={senacId} onChange={(e) => setSenacId(e.target.value)} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label>Gênero:</label>
          <div style={styles.radioGroup}>
            <label>
              <input type="radio" value="MALE" checked={gender === 'MALE'} onChange={() => setGender('MALE')} /> Masculino
            </label>
            <label>
              <input type="radio" value="FEMALE" checked={gender === 'FEMALE'} onChange={() => setGender('FEMALE')} /> Feminino
            </label>
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading} // Desativa o botão enquanto carrega
          style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
        >
          {loading ? 'A registar...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;