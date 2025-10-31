/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;