import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    // If no token or user data, redirect to login
    if (!token || !userData) {
        return <Navigate to="/login" replace />;
    }

    let user;
    try {
        user = JSON.parse(userData);
    } catch (e) {
        // Handle invalid JSON in localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return <Navigate to="/login" replace />;
    }

    // If route requires specific roles and user role is not included, redirect to an unauthorized page or dashboard
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // If authenticated and authorized, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
