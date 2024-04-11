import React, { createContext, useState, useContext } from 'react';

// 创建一个Context对象
const AuthContext = createContext({
  user: null, // 添加初始值以提供更好的自动完成体验
  login: async () => {},
  logout: () => {},
});

// AuthProvider组件管理认证状态，并将其传递给子组件
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 登录函数，异步获取用户信息并设置状态
  const loginUrl = "http://127.0.0.1:8000/login/";
  const login = async (userCredentials) => {
   
    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 确保请求体格式正确
        body: JSON.stringify(userCredentials),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      
      // 根据返回的code判断是否登录成功，这里以code: 1作为登录成功的标识
      if (data.code == 1) {
        setUser({ name: data.name, email: data.email, role: data.user_type, id:data.token }); 
        console.log('the auth',data)// 根据后端返回的数据设置用户状态
      } else {
        console.error('登录失败:', data.message);
      }
    } catch (error) {
      console.log(userCredentials);
      console.error('登录请求失败:', error);
    }
  };

  // 登出函数，清除用户状态
  const logout = () => {
    setUser(null);
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

