import React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    const storedUser = React.useMemo(() => {
        return JSON.parse(
            localStorage.getItem('user') || 
            localStorage.getItem('shopUser') || 
            localStorage.getItem('customerUser') || 
            'null'
        );
    }, []);

    const currentUser = user || (storedUser?.data || storedUser?.Data || storedUser);

    if (loading) return null;

    // 🔥 VERY IMPORTANT: skip auth check on login pages
    const isLoginPage =
        location.pathname === "/customer-login" ||
        location.pathname === "/admin/login" ||
        location.pathname === "/merchant-login";

    if (!currentUser && !isLoginPage) {
        let path = "/customer-login";

        if (location.pathname.startsWith("/admin")) path = "/admin/login";
        else if (location.pathname.startsWith("/merchant")) path = "/merchant-login";

        return <Navigate to={path} state={{ from: location }} replace />;
    }

    // 🔥 role check only if user exists
    if (currentUser && allowedRole) {
        const currentRoleId = Number(currentUser.roleId || currentUser.RoleId);

        if (currentRoleId !== Number(allowedRole)) {
            return <Navigate to="/home" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;