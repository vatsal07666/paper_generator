import React, { useState } from 'react';
import { Box, Button, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Field, Form, Formik } from 'formik';
import { NavLink, useHistory } from 'react-router-dom';
import { FaRegUser } from 'react-icons/fa';
import { RiLockPasswordLine } from 'react-icons/ri';
import * as Yup from "yup";
import { useSnackbar } from '../Context/SnackbarContext';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const{ ShowSnackbar } = useSnackbar();
    const history = useHistory();

    const initialValues = {username: '', password: ''};

    const validationSchema = Yup.object({
        username: Yup.string().required("Username or Email is Required*"),
        password: Yup.string().required("Password is required*")
    })

    const token = "vZt3CGeByg2P1RDS";

    const postData = (values, resetForm) => {
        const data = { username: values.username, password: values.password };

        axios.post("https://generateapi.techsnack.online/api/login", data, {
            headers: { Authorization: token, "Content-Type": "application/json" }
        })
        .then((res) => {
            console.log("/* Login Data */");
            console.log("POST response: ", res.data);

            // Save auth token
            localStorage.setItem("authToken", res.data.token);
            console.log(localStorage.getItem("authToken"));

            // Save role
            const role = res.data.role || 
                (values.username === "admin" && values.password === "Admin@666" ? "admin" : "user");
            localStorage.setItem("role", role);

            resetForm();

            // Redirect based on role
            if (role === "admin"){
                history.push("/admin");
                ShowSnackbar("Login Successful !", "success");
            } else {
                history.push("/")
                ShowSnackbar("Only Admin Can Login !", "info");
            }

        })
        .catch((err) => {
            console.error("POST error: ", err);
            ShowSnackbar("Login Failed !", "error");
        });
    };

    const handleSubmit = (values, { resetForm }) => {
        postData(values, resetForm);
    };

    return (
        <>
            <Box className="container" 
                sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
                    background: "linear-gradient(135deg, #faf7f5, #f3edea)", px: { xs: 2, sm: 0 }
                }}
            >
                <Paper elevation={0} className='form-container' 
                    sx={{ width: 420, p: { xs: 1, sm: 4 }, borderRadius: 4, background: "#ffffff",
                        border: "1px solid #e7ded9", boxShadow: "0 10px 30px rgba(78,52,46,0.08)"
                    }}
                >
                    <Formik initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({errors, touched}) => (
                            <Form className='login-form'>
                                <Box mb={2} textAlign="center">
                                    <Typography variant="h4" fontWeight={700} color="#4e342e">
                                        Paper Generator
                                    </Typography>

                                    <Typography variant="body2" color="#8d6e63">
                                        Login to generate question papers
                                    </Typography>
                                </Box>

                                <Box position="relative" sx={{ my: 4 }}>
                                    <FaRegUser style={{ position: "absolute", left: 12, color: "gray",
                                        alignSelf: "center", fontSize: "25px" }} 
                                    />
                                    <Field name="username" placeholder="Enter Username or Email" />
                                    {errors.username && touched.username && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.username}</div>}
                                </Box>
                                
                                <Box position="relative" sx={{ mb: 4 }}>
                                    <RiLockPasswordLine style={{ position: "absolute", left: 12, color: "gray", 
                                        alignSelf: "center", fontSize: "25px" }} 
                                    />
                                    <Field name="password" type={showPassword ? "text" : "password"} 
                                        placeholder="Enter Password" 
                                    />
                                    <Tooltip title={"View Password"}>
                                        <IconButton onClick={() => setShowPassword(!showPassword)}
                                            sx={{position: "absolute", alignSelf: "center", right: 5}}    
                                        >
                                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                                        </IconButton>
                                    </Tooltip>
                                    {errors.password && touched.password && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.password}</div>}
                                </Box>

                                <Button type="submit" fullWidth
                                    sx={{ mt: 1, py: 1.2, fontWeight: 600, fontSize: "15px", borderRadius: 2,
                                        background: "#6d4c41", color: "#fff",
                                        "&:hover": { background: "#5d4037" }
                                    }}
                                >
                                    Login
                                </Button>

                                <Box  sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2, flexWrap: "wrap" }}>
                                    <Typography component={"span"}>
                                        Don&apos;t have an Account ?
                                    </Typography>
                                    <NavLink className="register-link" to="/register">Register</NavLink>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Paper>
            </Box>
        </>
    )
}

export default LoginPage;