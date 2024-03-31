import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
const PasswordResetPage = () => {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState("");
  // 用于检测email是否符合格式
  const [emailError, setEmailError] = useState("");
  // confirm password
  const [pwdCon, setpwdCon] = useState("");
  // 用于检测confirm password是否为空
  const [pwdConError, setPwdConError] = useState("");
  const [code, setCode] = useState("");
  // 用于检测code是否为空
  const [codeError, setCodeError] = useState("");
  // 控制发送code按钮60s内不能按
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const handleCodeChange = (event) => {
    setCode(event.target.value);
    if (!event.target.value.trim()) {
      // 不符合要求则报错
      setCodeError("Code cannot be empty");
    } else {
      setCodeError("");
    }
  };
  // 监控发送code按钮，按下后60s无法再按
  useEffect(() => {
    let timer;
    if (buttonDisabled) {
      timer = setTimeout(() => setButtonDisabled(false), 60000);
    }
    return () => clearTimeout(timer);
  }, [buttonDisabled]);
  const getCode = () => {
    // 只对符合格式要求的发
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
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
            color: "error.main", // 使用主题中的错误颜色
            fontSize: "0.75rem", // 相当于12px
          }}
        >
          {emailError}
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center", // 垂直居中
          gap: "20px", // 子元素之间的间隔设置为20px
          width: "300px", // 总宽度设置为300px
          mb: 2,
        }}
      >
        <TextField
          label="verification code"
          variant="outlined"
          onChange={handleCodeChange}
          sx={{ flexBasis: "220px" }} // 设置基础宽度
        />
        <Button
          onClick={getCode}
          disabled={buttonDisabled}
          variant="contained"
          sx={{ flexBasis: "60px" }} // 设置基础宽度
        >
          code
        </Button>
      </Box>
      {codeError && (
        <Typography
          sx={{
            color: "error.main", // 使用主题中的错误颜色
            fontSize: "0.75rem", // 相当于12px
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
        sx={{ mb: 2, width: "300px" }}
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
      <Link to="/login">
        <Button variant="contained" sx={{ mb: 2, width: "300px" }}>
          Reset
        </Button>
      </Link>
    </Box>
  );
};

export default PasswordResetPage;