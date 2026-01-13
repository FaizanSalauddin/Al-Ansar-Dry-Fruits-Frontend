import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔄 Sync from localStorage on load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser?.token) {
      setUser(storedUser);
    }
  }, []);

  // ✅ LOGIN
  const login = (data) => {
    localStorage.setItem("userInfo", JSON.stringify(data));
    setUser(data);
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
