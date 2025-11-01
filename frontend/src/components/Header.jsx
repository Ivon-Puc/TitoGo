// 1. Importamos o 'NavLink' e mantemos o 'Link' (para o logo e botões)
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };
  
  // 2. [NOVO] Definimos as nossas classes do Tailwind aqui para ficar mais limpo
  const baseLinkClass = "font-semibold text-xl transition-all duration-300";
  
  // As classes que você pediu para o link ATIVO (bold e underline)
  const activeLinkClass = "font-bold underline"; 
  
  // A classe para o link INATIVO (o que tínhamos antes)
  const inactiveLinkClass = "hover:underline";

  return (
    <header className="flex justify-between items-center text-white py-6 px-8 md:px-32 bg-black drop-shadow-lg">
      <div className="flex items-center space-x-8">
        {/* Usamos <Link> normal para o logo */}
        <Link
          to="/"
          className="text-4xl font-bold hover:scale-105 transition-all duration-300"
        >
          TitoGo
        </Link>
        {isLoggedIn && (
          <>
            {/* 3. [MUDANÇA] Trocamos <Link> por <NavLink> */}
            <NavLink
              to="/search"
              // 4. [A MÁGICA] Usamos uma função na className
              className={({ isActive }) => 
                `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
              }
            >
              Buscar
            </NavLink>
            <NavLink
              to="/share"
              className={({ isActive }) => 
                `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
              }
            >
              Compartilhar
            </NavLink>
            <NavLink
              to="/trips"
              className={({ isActive }) => 
                `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
              }
            >
              Viagens
            </NavLink>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          // ... (o resto do seu código de "Logado" fica igual) ...
          <>
            <span className="text-white hidden md:block">
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
          // ... (o seu código de "Deslogado" fica igual) ...
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