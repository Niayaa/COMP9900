import React from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

const PasswordResetPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Reset Your Password
      </Typography>
      <TextField
        label="Email Address"
        variant="outlined"
        type="email"
        sx={{ mb: 2, width: "300px" }}
      />
      <Button variant="contained" sx={{ width: "300px" }}>
        Send Reset Link
      </Button>
    </Box>
  );
};

export default PasswordResetPage;
