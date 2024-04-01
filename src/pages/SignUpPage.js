import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
const SignUpPage = () => {
  const navigate = useNavigate();
  const [isOrganizer, setIsOrganizer] = useState(true);
  const [username, setUsername] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationAddress, setOrganizationAddress] = useState("");
  // 用于检测username是否为空
  const [usernameError, setUsernameError] = useState("");
  // email
  const [email, setEmail] = useState("");
  // 用于检测email是否符合格式
  const [emailError, setEmailError] = useState("");
  const [userAddress, setUserAddress] = useState("");
  // password
  const [password, setPassword] = useState("");
  //phone number
  const [phone, setPhone] = useState("");
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
      // 不符合要求则报错
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

  const handleRegisterAsOrganizer = () => {
    setIsOrganizer(true);
    // 重置表单字段
    resetFormFields();
  };

  // 当点击注册为顾客时
  const handleRegisterAsCustomer = () => {
    setIsOrganizer(false);
    // 重置表单字段
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
    // 重置所有的错误信息
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setPhoneError("");
    setPwdConError("");
  };

  // 假设注册API的URL如下
  const registerApiUrl = " https://66065321d92166b2e3c3968a.mockapi.io/users";
  const [signUpError, setSignUpError] = useState("");
  const handleSignUp = async () => {
    // 构建请求体数据
    setSignUpError("");
    const signUpData = {
      username: username,
      email: email,
      password: password,
      phone: phone,
      // 如果是组织者，还需要包含以下信息
      ...(isOrganizer && {
        organizationName: organizationName,
        organizationAddress: organizationAddress,
      }),
      // 如果是客户，可能需要包含支付账单地址
      ...(!isOrganizer && {
        userAddress: userAddress,
      }),
    };

    try {
      const response = await fetch(registerApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      });

      if (!response.ok) {
        // 如果HTTP响应码不是2xx, 抛出异常
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register.");
      }

      if (response.ok) {
        if (isOrganizer) {
          navigate("/Org_Acc"); // 如果是组织者，跳转到组织者账户页面
        } else {
          navigate("/Cus_Acc"); // 如果是客户，跳转到客户账户页面
        }
      } else {
        // 如果注册不成功，获取错误信息
        const errorData = await response.json();
        setSignUpError(
          errorData.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      // 如果请求失败，设置错误信息
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
          value={email}
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
          value={password}
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
          value={pwdCon}
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
          value={phone}
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
