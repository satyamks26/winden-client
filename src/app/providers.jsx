import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function Providers({ children }) {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (token) {
            setIsAuthenticated(true);
        }

        setIsLoading(false);

    }, []);

    const login = (token) => {

        localStorage.setItem("token", token);

        setIsAuthenticated(true);

    };

    const logout = () => {

        localStorage.removeItem("token");

        setIsAuthenticated(false);

    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}