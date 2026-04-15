import { Box, Button, Paper, Typography, TextField } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

    useEffect(() => {
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const adminExists = users.some((u) => u.role === "admin");

        if (!adminExists) {
            users.push({
            email: "admin@gmail.com",
            password: "123456",
            role: "admin",
            });

            localStorage.setItem("users", JSON.stringify(users));
        }
    }, []);

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.email === form.email && u.password === form.password
    );

    if (user) {
      localStorage.setItem("authToken", "demo-token");
      localStorage.setItem("role", user.role);

      if (user.role === "admin") navigate("/admin");
      else navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
      <Paper sx={{ p: 4, width: 300 }}>
        <Typography variant="h5" mb={2}>Login</Typography>

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

        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleLogin}>
          Login
        </Button>

        <Typography mt={2}>
          Don't have account? <Link to="/register">Register</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;