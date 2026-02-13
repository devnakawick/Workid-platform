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
            setUser({ id: 'demo_user', name: 'Nafees Ahamed', email: 'nafees@example.com' });
            setAppPublicSettings({ id: 'demo_app', public_settings: {} });
        };

        checkAppState();
    }, []);

    const logout = () => {
        // Mock logout - simply refreshing the page in standalone mode
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoadingAuth,
            isLoadingPublicSettings,
            appPublicSettings,
            logout
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
