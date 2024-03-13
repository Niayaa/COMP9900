import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
const OrganizerSignUpPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      {/* Add your form fields */}
      <TextField
        label="Name"
        variant="outlined"
        sx={{ mb: 2, width: "300px" }}
      />
      <TextField
        label="Email Address"
        variant="outlined"
        sx={{ mb: 2, width: "300px" }}
      />
      <TextField
        label="Password"
        variant="outlined"
        sx={{ mb: 2, width: "300px" }}
      />
      <TextField
        label="Organization Name"
        variant="outlined"
        sx={{ mb: 2, width: "300px" }}
      />
      <TextField
        label="Organization Address"
        variant="outlined"
        sx={{ mb: 2, width: "300px" }}
      />
      <TextField
        label="Phone Number"
        variant="outlined"
        sx={{ mb: 2, width: "300px" }}
      />
      {/* Add more fields as necessary */}
<<<<<<< HEAD
      <Button variant="contained" sx={{ mb: 2, width: "300px" }}>
        Sign up as Organizer
      </Button>
=======
      <Link to="/Org_Acc">
      <Button variant="contained" sx={{ mb: 2, width: "300px" }}>
        Sign up as Organizer
      </Button>
      </Link>
>>>>>>> Zzx-New
      <Link to="/login">Already have an account? Login !</Link>
    </Box>
  );
};

export default OrganizerSignUpPage;
