import React, { useState } from 'react';
// 1. [A MUDANÇA IMPORTANTE] Importamos o nosso 'api'
import api from '../services/api';
// import { useNavigate } from 'react-router-dom';

/**
 * Página de Cadastro (Registro)
 */
function RegisterPage() {
  // Estados para o formulário (baseado na sua imagem)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Campo "a senha"
  const [driverLicenseId, setDriverLicenseId] = useState('');
  const [gender, setGender] = useState('MALE'); // Assumindo 'MALE' ou 'FEMALE'
  const [senacId, setSenacId] = useState(''); // Campo obrigatório que descobrimos
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validação de palavra-passe
    if (password !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      return;
    }
    
    // (Adicione aqui o 'senacId' ao formulário ou envie um valor de teste)
    // Se o Senac ID não estiver no seu formulário, temos de o adicionar.
    // Por agora, vou enviar um valor de teste:
    const finalSenacId = senacId || 'SENAC-ID-PADRAO'; 

    try {
      // 2. [A MÁGICA] Usamos o api.post. Ele JÁ SABE o endereço do Render.
      // Não escrevemos 'localhost' em lado nenhum!
      const response = await api.post('/register', {
        firstName,
        lastName,
        email,
        password,
        driverLicenseId,
        gender,
        senacId: finalSenacId 
      });

      // 3. SUCESSO!
      setSuccess('Registo bem-sucedido! Pode agora fazer login.');
      
      // Limpar o formulário (opcional)
      // ...
      
      // Redirecionar para o login após 2 segundos (opcional)
      // setTimeout(() => {
      //   navigate('/login');
      // }, 2000);

    } catch (err) {
      // 4. FALHA
      if (err.response && err.response.data && err.response.data.message) {
        // Ex: "User already exists"
        setError(err.response.data.message);
      } else {
        setError('Ocorreu um erro no registo. Tente novamente.');
      }
      console.error("Erro no registo:", err);
    }
  };

  // 5. O seu formulário JSX
  // (Adapte este código ao seu formulário JSX existente)
  // O importante é ligar os 'onChange' e o 'onSubmit'
  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h2>Cadastro</h2>
      <form onSubmit={handleRegister}>
        {/* Mostra feedback de sucesso ou erro */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        {/* Nome */}
        <input placeholder="Nome" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        {/* Sobrenome */}
        <input placeholder="Sobrenome" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        {/* E-mail */}
        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {/* Senha */}
        <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {/* a senha */}
        <input type="password" placeholder="Confirme a senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        {/* Número da CNH */}
        <input placeholder="Número da CNH" value={driverLicenseId} onChange={(e) => setDriverLicenseId(e.target.value)} required />
        {/* Gênero (simplificado) */}
        <div>
          <label><input type="radio" value="MALE" checked={gender === 'MALE'} onChange={() => setGender('MALE')} /> Masculino</label>
          <label><input type="radio" value="FEMALE" checked={gender === 'FEMALE'} onChange={() => setGender('FEMALE')} /> Feminino</label>
        </div>
        
        {/* *** IMPORTANTE: Campo SenacId *** */}
        {/* O seu backend EXIGE este campo. O seu formulário precisa de o ter. */}
        <input placeholder="ID Senac" value={senacId} onChange={(e) => setSenacId(e.target.value)} required />

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default RegisterPage;