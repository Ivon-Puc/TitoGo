/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom"; // useLocation ADICIONADO
import { useAuth } from "../context/AuthContext"; // Importar o contexto

const ProtectedRoute = ({ children }) => {
    // Usamos isLoggedIn do AuthContext (melhor que ler diretamente o localStorage)
    const { isLoggedIn } = useAuth(); 
    
    // Obtém a localização atual para guardar o destino
    const location = useLocation(); 

    if (!isLoggedIn) {
        // Redireciona para /login, e usa 'state' para guardar o destino (location)
        // Isso permite que o LoginPage saiba para onde deve navegar após o login.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Se estiver logado, permite o acesso
    return children;
};

export default ProtectedRoute;