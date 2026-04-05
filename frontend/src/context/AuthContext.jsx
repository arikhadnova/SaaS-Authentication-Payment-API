import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cek apakah user sudah login saat app pertama dibuka
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            authService.getMe()
            .then(res => setUser(res.data.data))
            .catch(() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            })
            .finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await authService.login({email, password});
        const { accessToken, refreshToken, user } = res.data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setUser(user);
        return user;
    };

    const logout = async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        await authService.logout(refreshToken);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook agar mudah dipakai di komponen
export const useAuth = () => useContext(AuthContext);
