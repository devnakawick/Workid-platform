import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
    const [appPublicSettings, setAppPublicSettings] = useState(null);

    useEffect(() => {
        const checkAppState = async () => {
            // Standalone mode: Mocking authentication and app state
            console.log('Running in standalone mode - skipping API calls');
            setIsLoadingPublicSettings(false);
            setIsLoadingAuth(false);
            setIsAuthenticated(true);
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            } else {
                const defaultUser = {
                    id: 'demo_user',
                    name: 'John Doe',
                    email: 'john.doe@gmail.com',
                    role: 'Employer',
                    phone: '077-1234567',
                    location: 'Colombo 07',
                    experience: '5 Years Experience',
                    notificationsCount: 3,
                    messagesCount: 5,
                    isAvailable: true,
                    avatar: null
                };
                setUser(defaultUser);
                localStorage.setItem('user', JSON.stringify(defaultUser));
            }
            setAppPublicSettings({ id: 'demo_app', public_settings: {} });
        };

        checkAppState();
    }, []);

    const logout = () => {
        // Mock logout - simply refreshing the page in standalone mode
        localStorage.removeItem('user');
        window.location.reload();
    };

    const updateUser = (data) => {
        setUser(prev => {
            const updated = { ...prev, ...data };
            localStorage.setItem('user', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoadingAuth,
            isLoadingPublicSettings,
            appPublicSettings,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
