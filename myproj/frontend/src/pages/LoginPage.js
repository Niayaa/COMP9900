import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Box, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // 确保这里的路径是正确的

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth(); // 正确调用 useAuth 作为函数

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email cannot be empty");
      return;
    }
    if (!password.trim()) {
      setError("Password cannot be empty");
      return;
    }
    
    // 替换为你的后端登录API URL
    const loginUrl = "http://127.0.0.1:8000/login/";

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 登录成功
        localStorage.setItem("userToken", data.token); 
        // 调用 login 方法更新全局用户状态
        console.log("Before login call", { name: data.name, email: data.email, role: data.user_type });
        login({ email:email,password:password});
        console.log("After login call");
        // 根据用户类型导航到不同页面
        navigate(data.user_type === "customer" ? "/Cus_Account" : "/Org_Account");
      } else {
        // 登录失败，特定的错误信息处理
        setError("Account or password wrong, please try again");
      }
    } catch (error) {
      setError(error.message || "An error occurred during login.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      <TextField
        label="Email address/ID"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2, width: "300px" }}
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2, width: "300px" }}
      />
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Button type="submit" variant="contained" sx={{ mb: 2, width: "300px" }}>
        Log in
      </Button>
      <Link to="/password-reset">Forget your password?</Link>
      <Link to="/SignUpPage">Don't have an account? Register!</Link>
    </Box>
  );
};

export default LoginPage;
