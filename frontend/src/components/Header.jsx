import { useState } from "react"; // [NOVO] Para controlar o menu
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// [NOVO] Importamos os ícones que acabámos de instalar
import { FiMenu, FiX } from "react-icons/fi"; 

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  
  // [NOVO] Estado para controlar se o menu mobile está aberto ou fechado
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); // Fecha o menu ao sair
    navigate('/login');
  };

  // --- Definição das Classes (para ficar mais limpo) ---
  const baseLinkClass = "font-semibold text-xl transition-all duration-300";
  const activeLinkClass = "font-bold underline";
  const inactiveLinkClass = "hover:underline";
  
  // Função para criar os NavLinks (para evitar repetição)
  const renderNavLinks = (isMobile = false) => {
    // Classes diferentes para o menu mobile
    const mobileLinkClass = "text-black text-2xl font-semibold py-3 text-center w-full hover:bg-gray-100";
    const desktopLinkClass = ({ isActive }) => 
      `${baseLinkClass} text-white ${isActive ? activeLinkClass : inactiveLinkClass}`;
    
    const linkStyle = isMobile ? mobileLinkClass : desktopLinkClass;

    return (
      <>
        <NavLink to="/search" className={linkStyle} onClick={() => setIsMenuOpen(false)}>
          Buscar
        </NavLink>
        <NavLink to="/share" className={linkStyle} onClick={() => setIsMenuOpen(false)}>
          Compartilhar
        </NavLink>
        <NavLink to="/trips" className={linkStyle} onClick={() => setIsMenuOpen(false)}>
          Viagens
        </NavLink>
      </>
    );
  };

  return (
    // O 'header' agora tem padding (espaçamento) mobile-first
    <header className="flex justify-between items-center text-white py-4 px-6 md:px-32 bg-black drop-shadow-lg relative z-50">
      
      {/* Lado Esquerdo: Logo + Links de Desktop */}
      <div className="flex items-center space-x-8">
        <Link
          to="/"
          className="text-4xl font-bold hover:scale-105 transition-all duration-300"
          onClick={() => setIsMenuOpen(false)} // Fecha o menu se clicar no logo
        >
          TitoGo
        </Link>
        
        {/* [MUDANÇA] Links do Desktop: Escondidos em mobile (hidden), aparecem em desktop (md:flex) */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          {isLoggedIn && renderNavLinks(false)}
        </div>
      </div>

      {/* Lado Direito: Botões de Desktop + Botão Hamburger (Mobile) */}
      <div className="flex items-center space-x-4">
        
        {/* [MUDANÇA] Botões de Desktop: Escondidos em mobile, aparecem em desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <span className="text-white hidden lg:block"> {/* Esconde "Olá" em ecrãs médios */}
                Olá, {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-6 py-2 rounded-full font-semibold hover:bg-gray-800">
                Entrar
              </Link>
              <Link to="/register" className="px-6 py-2 bg-white text-black rounded-full font-semibold hover:bg-gray-200">
                Cadastrar
              </Link>
            </>
          )}
        </div>

        {/* [NOVO] Botão Hamburger: Aparece em mobile (md:hidden = "escondido em desktop") */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)} // Inverte o estado
            className="text-white text-3xl"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />} {/* Alterna o ícone */}
          </button>
        </div>
      </div>

      {/* [NOVO] O Menu Mobile (Dropdown) */}
      {/* Aparece apenas se 'isMenuOpen' for verdadeiro */}
      {isMenuOpen && (
        <div 
          className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg flex flex-col items-center"
        >
          {isLoggedIn ? (
            // --- Logado (Mobile) ---
            <div className="flex flex-col items-center w-full py-4 space-y-3">
              {renderNavLinks(true)} {/* Links (Buscar, etc.) */}
              <span className="text-gray-700 pt-2">Olá, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-6 py-2 w-11/12 rounded-full bg-gray-800 text-white font-semibold"
              >
                Sair
              </button>
            </div>
          ) : (
            // --- Deslogado (Mobile) ---
            <div className="flex flex-col items-center w-full py-4 space-y-3">
              <Link to="/login" className="px-6 py-2 w-11/12 rounded-full bg-gray-800 text-white text-center font-semibold" onClick={() => setIsMenuOpen(false)}>
                Entrar
              </Link>
              <Link to="/register" className="px-6 py-2 w-11/12 bg-gray-200 text-black rounded-full text-center font-semibold" onClick={() => setIsMenuOpen(false)}>
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;