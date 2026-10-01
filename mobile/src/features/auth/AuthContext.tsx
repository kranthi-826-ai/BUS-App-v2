import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAccessToken, getRole, clearTokens } from '../../storage/secureStore';
import * as authApi from '../../api/auth';
import { getRefreshToken } from '../../storage/secureStore';

interface AuthContextType {
    isAuthenticated: boolean;
    role: string | null;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    role: null,
    checkAuth: async () => {},
    logout: async () => {},
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    const checkAuth = async () => {
        const token = await getAccessToken();
        const userRole = await getRole();
        if (token) {
            setIsAuthenticated(true);
            setRole(userRole);
        } else {
            setIsAuthenticated(false);
            setRole(null);
        }
    };

    const logout = async () => {
        try {
            const rt = await getRefreshToken();
            if (rt) {
                await authApi.logout(rt);
            }
        } catch (e) {
            console.error("Logout API failed", e);
        } finally {
            await clearTokens();
            setIsAuthenticated(false);
            setRole(null);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, checkAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
