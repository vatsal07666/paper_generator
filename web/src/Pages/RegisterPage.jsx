import { Box, Button, Paper, Typography, TextField } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find((u) => u.email === form.email);

    if (exists) {
      alert("User already exists");
      return;
    }

    users.push({
      ...form,
      role: "user",
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registered Successfully");
    navigate("/log-in");
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
      <Paper sx={{ p: 4, width: 300 }}>
        <Typography variant="h5" mb={2}>Register</Typography>

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleRegister}>
          Register
        </Button>

        <Typography mt={2}>
          Already have account? <Link to="/log-in">Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterPage;