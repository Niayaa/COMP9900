import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Box, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { user, login } = useAuth(); // Get the user object as well to check the login status

  useEffect(() => {
    // Once the user is logged in, check the user's role to decide where to redirect
    if (user && user.role) {

      navigate(user.role === "customer" ? "/Cus_Account" : "/Org_Account", {
        state: {
          user_id: user.id,
          user_email: user.email,
          isCustomer: user.role === "customer",
          isLoggedIn: true,
        },
      });
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Email and Password cannot be empty");
      return;
    }

    try {
      await login({ email, password });

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
      <Link to="/SignUpPage">Don't have an account? Register!</Link>
    </Box>
  );
};

export default LoginPage;
