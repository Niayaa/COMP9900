import React, { createContext, useState, useContext } from "react";


const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: () => {},
});


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);


  const loginUrl = "http://127.0.0.1:8000/login/";
  const login = async (userCredentials) => {
    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
      });

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      if (data.code == 1) {
        setUser({
          name: data.name,
          email: data.email,
          role: data.user_type,
          id: data.token,
        });
        console.log("the auth", data);
      } else {
        throw new Error("failed: " + data.message);
      }
    } catch (error) {
      console.error("error:", error);
      throw error;
    }
  };


  const logout = () => {
    setUser(null);
  };


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
