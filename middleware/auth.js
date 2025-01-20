// middleware/auth.js
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/store.js';

export const AuthorizeUser = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to={'/auth/signin'} replace={true} />;
    }

    return children;
};

export const ProtectRoute = ({ children }) => {
    const username = useAuthStore().auth.username;
    if (!username) {
        return <Navigate to={'/auth/signin'} replace={true} />;
    }

    return children;
};

// Nouveau composant pour empêcher l'accès à la page de connexion si l'utilisateur est authentifié
export const RedirectIfAuthenticated = ({ children }) => {
    const token = localStorage.getItem('token');

    // Si un token est présent, redirige l'utilisateur vers le dashboard
    if (token) {
        return <Navigate to="/admin/dashboard" replace={true} />;
    }

    // Si aucun token, rend les enfants (ex : page de connexion)
    return children;
};
