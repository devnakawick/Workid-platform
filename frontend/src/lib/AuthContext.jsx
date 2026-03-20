import { createContext, useContext, useState, useEffect } from 'react';
import { verifyOTP, getMe } from '@/services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const accessToken = localStorage.getItem('access_token');
            if (accessToken) {
                try {
                    const res = await getMe();
                    const userData = res.data;
                    setUser(userData);
                    setRole(userData.user_type?.toLowerCase() || null);
                    setIsAuthenticated(true);
                } catch (err) {
                    console.error('Auth check failed:', err);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (phone, otp) => {
        try {
            const res = await verifyOTP(phone, otp);
            const { access_token, refresh_token, user_type, user_id } = res.data;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            // Minimal user from login response
            const minimalUser = { id: user_id, phone_number: phone, user_type };
            setUser(minimalUser);
            setRole(user_type?.toLowerCase() || null);
            setIsAuthenticated(true);

            return minimalUser;
        } catch (err) {
            console.error('Login error:', err.response?.data || err);
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
        window.location.href = '/login';

        const updateUser = (updates) => {
            setUser((prev) => ({ ...prev, ...updates }));
        };

        const value = {
            user,
            role,
            isAuthenticated,
            isLoading,
            login,
            logout,
            updateUser,
        };

        return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };

    export const useAuth = () => {
        const context = useContext(AuthContext);
        if (!context) {
            throw new Error('useAuth must be used within AuthProvider');
        }
        return context;
    };
}