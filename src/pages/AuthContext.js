import React, { createContext, useState, useContext } from 'react';

// 创建一个Context对象
const AuthContext = createContext(null);

// AuthProvider组件管理认证状态，并将其传递给子组件
export const AuthProvider = ({ children }) => {
  // 假设用户已经登录的状态
  const [user, setUser] = useState({ name: 'ABC', email: 'abc@gmail.com' ,role:'customer'});

  // 登录函数，设置用户状态
  const login = (userCredentials) => {
    // 在实际应用中，这里应该有一个请求后端验证用户凭证的逻辑
    setUser(userCredentials); // 假设用户凭证验证成功后，设置用户状态
  };

  // 登出函数，清除用户状态
  const logout = () => {
    setUser(null); // 清除用户状态
  };

  // 传递user对象和login、logout函数给context的provider
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义钩子，以便在组件中更容易地使用认证状态和函数
export const useAuth = () => useContext(AuthContext);

