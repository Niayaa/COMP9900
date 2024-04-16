import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import UseEventPage from "./FakeCallEventPage";

const LoginPage = () => {
  return (
    <Box
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
        sx={{ mb: 2, width: "300px" }}
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        sx={{ mb: 2, width: "300px" }}
      />
      <Link to="/MainPage">
        <Button variant="contained" sx={{ mb: 2, width: "300px" }}>
          Log in
        </Button>
      </Link>
      <Link to="/password-reset">Forget your password?</Link>
      <Link to="/SignUpPage">Don't have account? Register!</Link>
    </Box>
  );
};

export default LoginPage;