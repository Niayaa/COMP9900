import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
const PasswordResetPage = () => {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState("");

  const [emailError, setEmailError] = useState("");

  const [pwdCon, setpwdCon] = useState("");

  const [pwdConError, setPwdConError] = useState("");
  const [code, setCode] = useState("");

  const [codeError, setCodeError] = useState("");

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const navigate = useNavigate();
  const handleCodeChange = (event) => {
    setCode(event.target.value);
    if (!event.target.value.trim()) {

      setCodeError("Code cannot be empty");
    } else {
      setCodeError("");
    }
  };

  useEffect(() => {
    let timer;
    if (buttonDisabled) {
      timer = setTimeout(() => setButtonDisabled(false), 60000);
    }
    return () => clearTimeout(timer);
  }, [buttonDisabled]);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (!event.target.value.trim()) {

      setPasswordError("Password cannot be empty");
    } else {
      setPasswordError("");
    }
  };
  const validateEmail = (email) => {
    const regexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexPattern.test(email);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (!validateEmail(event.target.value)) {

      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePwdConChange = (event) => {
    setpwdCon(event.target.value);
    if (!event.target.value.trim()) {

      setPwdConError("Confirm Password cannot be empty");
    } else {
      setPwdConError("");
    }
    if (password !== event.target.value) {

      setPwdConError("Confirm Password must be the same as password");
    } else {
      setPwdConError("");
    }
  };

  const getCode = async () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    const sendCodeApi = "http://127.0.0.1:8000/send_reset_code/";
    let errorData;
    try {
      const response = await fetch(sendCodeApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok)
        throw new Error(errorData.error || "Error sending code.");


      alert("Verification code sent. Please check your email.");
      setButtonDisabled(true);
    } catch (error) {
      setEmailError(error.message);
    }
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    if (password !== pwdCon) {
      setPwdConError("Confirm Password must be the same as password");
      return;
    }

    const resetPasswordApi = "http://127.0.0.1:8000/reset_password/";
    try {
      const response = await fetch(resetPasswordApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
          newPassword: password,
        }),
      });

      if (!response.ok) throw new Error("Error resetting password.");


      alert(
        "Password reset successfully. You can now log in with the new password."
      );
      navigate("/login");
    } catch (error) {
      setPasswordError(error.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: 5,
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Reset Your Password
      </Typography>
      <TextField
        label="Email Address"
        onChange={handleEmailChange}
        variant="outlined"
        sx={{ mb: 2, width: "300px" }}
      />
      {emailError && (
        <Typography
          sx={{
            color: "error.main",
            fontSize: "0.75rem",
          }}
        >
          {emailError}
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          width: "300px",
          mb: 2,
        }}
      >
        <TextField
          label="verification code"
          variant="outlined"
          onChange={handleCodeChange}
          sx={{ flexBasis: "220px" }}
        />
        <Button
          onClick={getCode}
          disabled={buttonDisabled}
          variant="contained"
          sx={{ flexBasis: "60px" }}
        >
          code
        </Button>
      </Box>
      {codeError && (
        <Typography
          sx={{
            color: "error.main",
            fontSize: "0.75rem",
          }}
        >
          {codeError}
        </Typography>
      )}
      <TextField
        label="Password"
        onChange={handlePasswordChange}
        variant="outlined"
        type="password"
        sx={{ mb: 2, width: "300px" }}
      />
      {passwordError && (
        <Typography
          sx={{
            color: "error.main",
            fontSize: "0.75rem",
          }}
        >
          {passwordError}
        </Typography>
      )}
      <TextField
        label="Password confirmation"
        onChange={handlePwdConChange}
        variant="outlined"
        type="password"
        sx={{ mb: 2, width: "300px" }}
      />
      {pwdConError && (
        <Typography
          sx={{
            color: "error.main",
            fontSize: "0.75rem",
          }}
        >
          {pwdConError}
        </Typography>
      )}
      <Link to="/login">
        <Button
          variant="contained"
          sx={{ mb: 2, width: "300px" }}
          onClick={handlePasswordReset}
        >
          Reset
        </Button>
      </Link>
    </Box>
  );
};

export default PasswordResetPage;
