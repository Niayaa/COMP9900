import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useAuth } from "./AuthContext";
const SignUpPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isOrganizer, setIsOrganizer] = useState(true);
  const [username, setUsername] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationAddress, setOrganizationAddress] = useState("");

  const [usernameError, setUsernameError] = useState("");
  // email
  const [email, setEmail] = useState("");

  const [emailError, setEmailError] = useState("");
  const [userAddress, setUserAddress] = useState("");
  // password
  const [password, setPassword] = useState("");
  //phone number
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [passwordError, setPasswordError] = useState("");
  // confirm password
  const [pwdCon, setpwdCon] = useState("");

  const [pwdConError, setPwdConError] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    if (!event.target.value.trim()) {

      setUsernameError("Username cannot be empty");
    } else {
      setUsernameError("");
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
  const handleOrganizationNameChange = (event) => {
    setOrganizationName(event.target.value);
  };

  const handleOrganizationAddressChange = (event) => {
    setOrganizationAddress(event.target.value);
  };

  const handleUserAddressChange = (event) => {
    setUserAddress(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (!event.target.value.trim()) {

      setPasswordError("Password cannot be empty");
    } else {
      setPasswordError("");
    }
  };
  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
    if (!event.target.value.trim()) {
      setPhoneError("phone number cannot be empty");
    } else {
      setPhoneError("");
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

  const handleRegisterAsOrganizer = () => {
    setIsOrganizer(true);

    resetFormFields();
  };


  const handleRegisterAsCustomer = () => {
    setIsOrganizer(false);

    resetFormFields();
  };

  // 重置表单字段的函数
  const resetFormFields = () => {
    setUsername("");
    setUserAddress("");
    setOrganizationName("");
    setOrganizationAddress("");
    setEmail("");
    setPassword("");
    setPhone("");
    setpwdCon("");

    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setPhoneError("");
    setPwdConError("");
  };


  const registerApiUrl = " http://127.0.0.1:8000/register/";
  const [signUpError, setSignUpError] = useState("");
  const handleSignUp = async () => {
    setSignUpError("");
    const role = isOrganizer ? "organizer" : "customer";
    const signUpData = {
      ...(isOrganizer && {
        organization_name: organizationName,
        organization_address: organizationAddress,
      }),
      ...(role === "customer" && {
        username: username,
        bill_address: userAddress,
      }),
      role: role,
      email: email,
      password: password,
      phone: phone,
    };

    try {
      const response = await fetch(registerApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      });

      if (response.ok) {

        const data = await response.json();
        localStorage.setItem("userToken", data.token);

        console.log("Before login call", {
          name: data.name,
          email: data.email,
          role: data.user_type,
        });
        login({ email: email, password: password });
        console.log("After login call");

        navigate("/mainpage", {
          state: {
            isCustomer: role === "customer",
            user_id: data.user_id,
            user_email: email,
            isLoggedIn: true,
          },
        });
      } else {

        const errorData = await response.json();
        setSignUpError(
          errorData.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {

      setSignUpError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "300px",
          gap: 2,
          mt: 20,
        }}
      >
        <Button
          variant={isOrganizer ? "contained" : "outlined"}
          onClick={handleRegisterAsOrganizer}
        >
          Register as Organizer
        </Button>
        <Button
          variant={!isOrganizer ? "contained" : "outlined"}
          onClick={handleRegisterAsCustomer}
        >
          Register as Customer
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%", // Ensuring it takes the full width of the parent
          maxWidth: "400px", // Adjusted width
          "& .MuiTextField-root": { width: "100%" }, // Ensure TextField takes the full width of its parent
          ml: 40,
        }}
      >
        {isOrganizer ? (
          <>
            <TextField
              label="Organization Name"
              value={organizationName}
              onChange={handleOrganizationNameChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Organization Address"
              value={organizationAddress}
              onChange={handleOrganizationAddressChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </>
        ) : (
          <>
            <TextField
              label="Name"
              onChange={handleUsernameChange}
              value={username}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Payment Bill Address"
              value={userAddress}
              onChange={handleUserAddressChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            {usernameError && (
              <Typography
                sx={{
                  color: "error.main",
                  fontSize: "0.75rem",
                }}
              >
                {usernameError}
              </Typography>
            )}
          </>
        )}

        <TextField
          label="Email Address"
          onChange={handleEmailChange}
          value={email}
          variant="outlined"
          sx={{ mb: 2 }}
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
        <TextField
          label="Password"
          value={password}
          onChange={handlePasswordChange}
          variant="outlined"
          type="password"
          sx={{ mb: 2 }}
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
          value={pwdCon}
          onChange={handlePwdConChange}
          variant="outlined"
          type="password"
          sx={{ mb: 2 }}
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
        <TextField
          label="Phone Number"
          value={phone}
          onChange={handlePhoneChange}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        {phoneError && (
          <Typography
            sx={{
              color: "error.main",
              fontSize: "0.75rem",
            }}
          >
            {phoneError}
          </Typography>
        )}
        {signUpError && <Typography color="error">{signUpError}</Typography>}
        <Button variant="contained" onClick={handleSignUp} sx={{ mb: 2 }}>
          Sign Up
        </Button>

        <Link to="/login">Already have an account? Login!</Link>
      </Box>
    </Box>
  );
};

export default SignUpPage;
