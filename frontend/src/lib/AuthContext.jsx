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
            console.log('Auth init - token exists:', !!accessToken);
            
            // Try to load user data from localStorage first
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    console.log('Auth init - loaded from localStorage:', userData);
                    setUser(userData);
                    setRole(userData.user_type?.toLowerCase() || userData.role?.toLowerCase() || null);
                    setIsAuthenticated(true);
                } catch (err) {
                    console.error('Failed to parse stored user data:', err);
                    localStorage.removeItem('user');
                }
            }
            
            if (accessToken) {
                try {
                    const res = await getMe();
                    console.log('Auth init - getMe success:', res.data);
                    const backendData = res.data;
                    
                    // Only update if localStorage doesn't exist or if backend has newer data
                    const currentStoredUser = localStorage.getItem('user');
                    if (!currentStoredUser) {
                        // No stored user, use backend data
                        setUser(backendData);
                        setRole(backendData.user_type?.toLowerCase() || null);
                        setIsAuthenticated(true);
                        localStorage.setItem('user', JSON.stringify(backendData));
                    } else {
                        // Has stored user, merge backend data but preserve localStorage changes
                        const storedUserData = JSON.parse(currentStoredUser);
                        const mergedData = {
                            ...backendData,
                            // Preserve frontend-only fields from localStorage
                            name: storedUserData.name || backendData.full_name || backendData.name,
                            phone: storedUserData.phone || backendData.phone_number || backendData.phone,
                            location: storedUserData.location || backendData.city || backendData.location,
                            experience: storedUserData.experience || backendData.experience_years || storedUserData.experience,
                            avatar: storedUserData.avatar || backendData.profile_photo || backendData.avatar,
                            // Preserve notification and language settings
                            notifications: storedUserData.notifications || backendData.notifications || {
                                jobAlerts: true,
                                appUpdates: true,
                                weeklySummary: true,
                            },
                            language: storedUserData.language || backendData.language || 'en',
                        };
                        setUser(mergedData);
                        setRole(mergedData.user_type?.toLowerCase() || null);
                        setIsAuthenticated(true);
                        localStorage.setItem('user', JSON.stringify(mergedData));
                    }
                } catch (err) {
                    console.error('Auth check failed:', err.response?.data || err.message);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');
                    setUser(null);
                    setRole(null);
                    setIsAuthenticated(false);
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (phone, otp) => {
        try {
            console.log('Login attempt:', phone, otp);
            const res = await verifyOTP(phone, otp);
            console.log('Login success:', res.data);
            const { access_token, refresh_token, user_type, user_id } = res.data;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            // Check if we have existing user data in localStorage to preserve changes
            const existingUserData = localStorage.getItem('user');
            let fullUser = { id: user_id, phone_number: phone, user_type };
            
            try {
                const meRes = await getMe();
                const backendData = meRes.data;
                
                if (existingUserData) {
                    // Merge with existing localStorage data to preserve changes
                    const storedUserData = JSON.parse(existingUserData);
                    fullUser = {
                        ...backendData,
                        // Preserve frontend-only fields from localStorage
                        name: storedUserData.name || backendData.full_name || backendData.name,
                        phone: storedUserData.phone || backendData.phone_number || backendData.phone,
                        location: storedUserData.location || backendData.city || backendData.location,
                        experience: storedUserData.experience || backendData.experience_years || storedUserData.experience,
                        avatar: storedUserData.avatar || backendData.profile_photo || backendData.avatar,
                        // Preserve notification and language settings
                        notifications: storedUserData.notifications || backendData.notifications || {
                            jobAlerts: true,
                            appUpdates: true,
                            weeklySummary: true,
                        },
                        language: storedUserData.language || backendData.language || 'en',
                    };
                } else {
                    fullUser = backendData;
                }
            } catch (_) { 
                // Fall back to minimal user but check localStorage
                if (existingUserData) {
                    const storedUserData = JSON.parse(existingUserData);
                    fullUser = { ...fullUser, ...storedUserData };
                }
            }

            setUser(fullUser);
            setRole((fullUser.user_type || user_type)?.toLowerCase() || null);
            setIsAuthenticated(true);
            
            // Save the merged data to localStorage
            localStorage.setItem('user', JSON.stringify(fullUser));

            return fullUser;
        } catch (err) {
            console.error('Login error:', err.response?.data || err);
            throw err;
        }
    };

    const loginWithPassword = async (phone, password) => {
        try {
            const { loginWithPassword: apiLoginWithPassword } = await import('@/services/authService');
            const res = await apiLoginWithPassword(phone, password);
            const { access_token, refresh_token, user_type, user_id } = res.data;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            // Check if we have existing user data in localStorage to preserve changes
            const existingUserData = localStorage.getItem('user');
            let fullUser = { id: user_id, phone_number: phone, user_type };
            
            try {
                const meRes = await getMe();
                const backendData = meRes.data;
                
                if (existingUserData) {
                    // Merge with existing localStorage data to preserve changes
                    const storedUserData = JSON.parse(existingUserData);
                    fullUser = {
                        ...backendData,
                        // Preserve frontend-only fields from localStorage
                        name: storedUserData.name || backendData.full_name || backendData.name,
                        phone: storedUserData.phone || backendData.phone_number || backendData.phone,
                        location: storedUserData.location || backendData.city || backendData.location,
                        experience: storedUserData.experience || backendData.experience_years || storedUserData.experience,
                        avatar: storedUserData.avatar || backendData.profile_photo || backendData.avatar,
                        // Preserve notification and language settings
                        notifications: storedUserData.notifications || backendData.notifications || {
                            jobAlerts: true,
                            appUpdates: true,
                            weeklySummary: true,
                        },
                        language: storedUserData.language || backendData.language || 'en',
                    };
                } else {
                    fullUser = backendData;
                }
            } catch (_) { 
                // Fall back to minimal user but check localStorage
                if (existingUserData) {
                    const storedUserData = JSON.parse(existingUserData);
                    fullUser = { ...fullUser, ...storedUserData };
                }
            }

            setUser(fullUser);
            setRole((fullUser.user_type || user_type)?.toLowerCase() || null);
            setIsAuthenticated(true);
            
            // Save the merged data to localStorage
            localStorage.setItem('user', JSON.stringify(fullUser));

            return fullUser;
        } catch (err) {
            console.error('Login with password error:', err.response?.data || err);
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
    };

    const updateUser = (updates) => {
        setUser((prev) => {
            const updatedUser = { ...prev, ...updates };
            // Also update localStorage for persistence
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        });
        if (updates.role || updates.user_type) {
            setRole((updates.role || updates.user_type).toLowerCase());
        }
    };

    const value = {
        user,
        role,
        isAuthenticated,
        isLoading,
        login,
        loginWithPassword,
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