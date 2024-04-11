import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
const SignUpPage = () => {
  const [isOrganizer, setIsOrganizer] = useState(true);
  const [username, setUsername] = useState("");
  // 用于检测username是否为空
  const [usernameError, setUsernameError] = useState("");
  // email
  const [email, setEmail] = useState("");
  // 用于检测email是否符合格式
  const [emailError, setEmailError] = useState("");

  // password
  const [password, setPassword] = useState("");
  //phone number
  const [phone, setphone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  // 用于检测password是否为空
  const [passwordError, setPasswordError] = useState("");
  // confirm password
  const [pwdCon, setpwdCon] = useState("");
  // 用于检测confirm password是否为空
  const [pwdConError, setPwdConError] = useState("");
  // username变动时检测是否符合要求
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    if (!event.target.value.trim()) {
      // 不符合要求则报错
      setUsernameError("Username cannot be empty");
    } else {
      setUsernameError("");
    }
  };

  // 邮件正则
  const validateEmail = (email) => {
    const regexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexPattern.test(email);
  };
  // email变动时检测是否符合要求
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (!validateEmail(event.target.value)) {
      // 不符合格式报错
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (!event.target.value.trim()) {
      // 不符合要求则报错
      setPasswordError("Password cannot be empty");
    } else {
      setPasswordError("");
    }
  };
  const handlePhoneChange = (event) => {
    setphone(event.target.value);
    if (!event.target.value.trim()) {
      setPhoneError("phone number cannot be empty");
    } else {
      setPhoneError("");
    }
  };
  // cofirm password变动时检测是否符合要求
  const handlePwdConChange = (event) => {
    setpwdCon(event.target.value);
    if (!event.target.value.trim()) {
      // 不符合要求则报错
      setPwdConError("Confirm Password cannot be empty");
    } else {
      setPwdConError("");
    }
    if (password !== event.target.value) {
      // 与password不相同报错
      setPwdConError("Confirm Password must be the same as password");
    } else {
      setPwdConError("");
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
          onClick={() => setIsOrganizer(true)}
        >
          Register as Organizer
        </Button>
        <Button
          variant={!isOrganizer ? "contained" : "outlined"}
          onClick={() => setIsOrganizer(false)}
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
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Organization Address"
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </>
        ) : (
          <>
            <TextField
              label="Payment Bill Address"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Name"
              onChange={handleUsernameChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            {usernameError && (
              <Typography
                sx={{
                  color: "error.main", // 使用主题中的错误颜色
                  fontSize: "0.75rem", // 相当于12px
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
          variant="outlined"
          sx={{ mb: 2 }}
        />
        {emailError && (
          <Typography
            sx={{
              color: "error.main", // 使用主题中的错误颜色
              fontSize: "0.75rem", // 相当于12px
            }}
          >
            {emailError}
          </Typography>
        )}
        <TextField
          label="Password"
          onChange={handlePasswordChange}
          variant="outlined"
          type="password"
          sx={{ mb: 2 }}
        />
        {passwordError && (
          <Typography
            sx={{
              color: "error.main", // 使用主题中的错误颜色
              fontSize: "0.75rem", // 相当于12px
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
          sx={{ mb: 2 }}
        />
        {pwdConError && (
          <Typography
            sx={{
              color: "error.main", // 使用主题中的错误颜色
              fontSize: "0.75rem", // 相当于12px
            }}
          >
            {pwdConError}
          </Typography>
        )}
        <TextField
          label="Phone Number"
          onChange={handlePhoneChange}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        {phoneError && (
          <Typography
            sx={{
              color: "error.main", // 使用主题中的错误颜色
              fontSize: "0.75rem", // 相当于12px
            }}
          >
            {phoneError}
          </Typography>
        )}
        <Link to={isOrganizer ? "/MainPage" : "/MainPage"}>
          <Button variant="contained" sx={{ mb: 2 }}>
            Sign Up
          </Button>
        </Link>

        <Link to="/login">Already have an account? Login!</Link>
      </Box>
    </Box>
  );
};

export default SignUpPage;
