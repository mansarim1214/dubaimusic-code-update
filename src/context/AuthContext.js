import React, { createContext, useContext, useState, useEffect } from 'react';
// Import jwt-decode if you want to decode JWTs (optional)
// import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);  // Added loading state

    useEffect(() => {
        // Simulate fetching user data or token from localStorage/API
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode token and set user data (assuming token contains user info)
                // const userData = jwtDecode(token); // Use jwt-decode if needed
                const userData = { role: 'admin' }; // Example user with admin role
                setUser(userData);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
        setLoading(false); // Set loading to false after token check
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null); // Clear user data
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
