import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../api/use-store';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAdmin } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdmin) {
            navigate('/save-the-date', { replace: true });
        }
    }, [isAdmin, navigate]);

    // If not admin, don't render children (will redirect)
    if (!isAdmin) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
