import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Session Recovery (on refresh)
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');

            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            }
        } catch (error) {
            console.error("Session recovery failed", error);
            localStorage.clear();
        } finally {
            setLoading(false);
        }
    }, []);

    // ✅ LOGIN (no navigation here)
    const login = (userData, token) => {
        if (!userData) return;

        const normalizedUser = userData.data || userData.Data || userData;

        setUser(normalizedUser);

        localStorage.setItem('user', JSON.stringify(normalizedUser));

        if (token) {
            localStorage.setItem("token", token);
        }
    };

    // ✅ LOGOUT (clean)
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    // ✅ Role helpers (VERY IMPORTANT)
    const roleId = Number(user?.roleId || user?.RoleId);

    const isAdmin = roleId === 1;
    const isBusiness = roleId === 2;
    const isCustomer = roleId === 3;

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            loading,
            isAdmin,
            isBusiness,
            isCustomer
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// ✅ Custom Hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};