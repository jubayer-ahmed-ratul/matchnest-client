import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setLoading(false);
      // verify with backend and update with full user data (including profilePhoto)
      getMe()
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        })
        .catch(() => {});
    } else if (token) {
      getMe()
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    // check redirect
    const redirect = localStorage.getItem("redirectAfterLogin");
    if (redirect) {
      localStorage.removeItem("redirectAfterLogin");
      window.location.href = redirect;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
