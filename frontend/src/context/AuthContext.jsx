// 1. REMOVA 'React' e 'useEffect' dos imports
import { createContext, useState, useContext } from 'react'; 
import { jwtDecode } from 'jwt-decode';
import api from '../services/api'; 

const AuthContext = createContext();

// 2. ADICIONE esta linha de comentário para desligar o aviso de 'children'
// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  // ... (o resto do ficheiro fica igual)
  // O estado 'user' vai guardar os dados do utilizador se estiver logado
  // (Inicialmente, tentamos ler do localStorage, caso o utilizador já tenha sessão)
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Validar se o token não expirou (opcional mas recomendado)
        // if (decoded.exp * 1000 < Date.now()) {
        //   localStorage.removeItem('token');
        //   return null;
        // }
        
        // Adiciona o token ao header do axios para pedidos futuros
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return decoded; // Retorna o utilizador (ex: { id: 1, email: '...' })
      } catch (e) {
        console.error("Token de login inválido", e);
        localStorage.removeItem('token');
        return null;
      }
    }
    return null;
  });

  // Função para o LOGIN
  const login = (token) => {
    // 1. Guardar o token no localStorage
    localStorage.setItem('token', token);
    
    // 2. Adicionar o token ao header padrão do axios
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // 3. Descodificar o token para obter os dados do utilizador
    const decodedUser = jwtDecode(token);
    
    // 4. ATUALIZAR O ESTADO GLOBAL!
    // Isto vai "avisar" todos os componentes (como o Navbar)
    setUser(decodedUser); 
  };

  // Função para o LOGOUT
  const logout = () => {
    // 1. Remover o token do localStorage
    localStorage.removeItem('token');
    
    // 2. Remover o header do axios
    delete api.defaults.headers.common['Authorization'];
    
    // 3. ATUALIZAR O ESTADO GLOBAL!
    setUser(null); // Define o utilizador como nulo
  };

  // Valor a partilhar: o objeto 'user' e as funções 'login' e 'logout'
  const value = {
    user,       // O objeto do utilizador (ou null)
    login,      // A função para fazer login
    logout,     // A função para fazer logout
    isLoggedIn: !!user // Um booleano (true/false) para saber se está logado
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * 3. Criar o "Atalho" (Hook personalizado)
 * Em vez de importar 'useContext(AuthContext)' em todo o lado,
 * apenas importamos 'useAuth()'.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};