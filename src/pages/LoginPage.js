import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    // 使用 mockapi 的 URL 替换下面的 URL
    const loginUrl = "https://66065321d92166b2e3c3968a.mockapi.io/users";

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // 登录失败，可能是账号或密码错误, 假设后端会在登录失败时返回状态码401，并且不会包含其他类型的错误信息。
          throw new Error("Account or password wrong, please try again.");
        }
        const errorData = await response.json(); // 假设其他错误信息在响应体的JSON中
        throw new Error(
          errorData.message || "An error occurred while logging in."
        );
      }

      const data = await response.json();
      // 可以在这里进行一些状态管理，例如保存用户信息或令牌等
      localStorage.setItem("userToken", data.token);

      navigate("/MainPage"); // 登录成功后导航到主页
    } catch (error) {
      setError(error.message);
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
      <Link to="/SignUpPage">Don't have account? Register!</Link>
    </Box>
  );
};

export default LoginPage;
