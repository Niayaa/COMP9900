import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
<<<<<<< HEAD
=======
import UseEventPage from "./FakeCallEventPage";
>>>>>>> Zzx-New

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
<<<<<<< HEAD
      <Button variant="contained" sx={{ mb: 2, width: "300px" }}>
        Log in
      </Button>
=======
      <Link to="/MainPage">
      <Button variant="contained" sx={{ mb: 2, width: "300px" }}>
        Log in
      </Button>
      </Link>
>>>>>>> Zzx-New
      <Link to="/password-reset">Forget your password?</Link>
      <Link to="/signup-organizer">
        Don't have account? Register as organizer!
      </Link>
      <Link to="/signup-customer">
        Don't have account? Register as customer!
      </Link>
    </Box>
  );
};

export default LoginPage;
