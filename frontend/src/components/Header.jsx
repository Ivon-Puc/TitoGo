import { Link, useNavigate } from "react-router-dom";
// 1. [REMOVIDO] Não precisamos mais de useState ou useEffect
// import { useState, useEffect } from "react";

// 2. [ADICIONADO] Importamos o nosso hook 'useAuth'
import { useAuth } from "../context/AuthContext";

const Header = () => {
  // 3. [REMOVIDO] O estado local já não é necessário
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navigate = useNavigate();

  // 4. [ADICIONADO] Pegamos o estado REAL do nosso AuthContext
  // O 'isLoggedIn' e o 'user' virão automaticamente do contexto!
  const { isLoggedIn, user, logout } = useAuth();

  // 5. [REMOVIDO] O useEffect já não é necessário.
  // O AuthProvider (que está no main.jsx) já faz esta lógica por nós.
  /*
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);
  */

  // 6. [ATUALIZADO] O handleLogout agora usa a função 'logout' do contexto
  const handleLogout = () => {
    // localStorage.removeItem('token'); // O 'logout()' já faz isto
    // setIsLoggedIn(false); // O 'logout()' já faz isto
    logout(); 
    navigate('/login'); // Redireciona para o login (isto estava bom!)
  };

  // 7. [O JSX] O seu JSX (HTML) já está quase perfeito!
  // A lógica 'isLoggedIn ? (...)' vai funcionar automaticamente.
  // A única coisa que vou adicionar é uma saudação "Olá, [email]".
  return (
    <header className="flex justify-between items-center text-white py-6 px-8 md:px-32 bg-black drop-shadow-lg">
      <div className="flex items-center space-x-8">
        <a
          href="/"
          className="text-4xl font-bold hover:scale-105 transition-all duration-300"
        >
          TitoGo
        </a>
        {isLoggedIn && (
          <>
            <Link
              to="/search"
              className="font-semibold text-xl hover:underline transition-all duration-300"
            >
              Buscar
            </Link>
            <Link
              to="/share"
              className="font-semibold text-xl hover:underline transition-all duration-300"
            >
              Compartilhar
            </Link>
            <Link
              to="/trips"
              className="font-semibold text-xl hover:underline transition-all duration-300"
            >
              Viagens
            </Link>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          // --- Se estiver LOGADO ---
          <>
            {/* [BÓNUS] Mostrar quem está logado (escondido em ecrãs pequenos) */}
            <span className="text-white hidden md:block">
              {/* O 'user' vem do useAuth(). O '?' previne erros se 'user' for nulo. */}
              Olá, {user?.email} 
            </span>
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              Sair
            </button>
          </>
        ) : (
          // --- Se estiver DESLOGADO (O seu código original) ---
          <>
            <Link
              to="/login"
              className="px-6 py-2 rounded-full font-semibold hover:bg-gray-800 hover:text-white transition-all duration-300"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              Cadastrar
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;