import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";

const SignUpPage = () => {
  const [isOrganizer, setIsOrganizer] = useState(true);

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
          </>
        )}

        <TextField label="Name" variant="outlined" sx={{ mb: 2 }} />
        <TextField label="Email Address" variant="outlined" sx={{ mb: 2 }} />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password confirmation"
          variant="outlined"
          type="password"
          sx={{ mb: 2 }}
        />
        <TextField label="Phone Number" variant="outlined" sx={{ mb: 2 }} />

        <Link to={isOrganizer ? "/Org_Acc" : "/Cus_Acc"}>
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
