import React, { useRef, useState } from 'react';
import { Box, Button, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Field, Form, Formik } from 'formik';
import { NavLink, useHistory } from 'react-router-dom';
import { RiLockPasswordLine } from 'react-icons/ri';
import * as Yup from "yup";
import { useSnackbar } from '../Context/SnackbarContext';
import { FaEye, FaRegUser } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const{ ShowSnackbar } = useSnackbar();
    const history = useHistory();
    const formikRef = useRef();

    const initialValues = {username: '', password: ''};

    const validationSchema = Yup.object({
        username: Yup.string().required("Username or Email is Required*"),
        password: Yup.string().required("Password is required*").min(8,"Password must be at least 8 characters")
                .matches(/[A-Z]/, "Password must contain at least one uppercase character")
                .matches(/[a-z]/, "Password must contain at least one lowercase character")
                .matches(/\d/, "Password must contain at least one number")
                .matches(/[!@#$%^&*()]/, "Password must contain at least one special character")
    })

    const token = "vZt3CGeByg2P1RDS";

    const postData = (values, resetForm) => {
        const initializeAdmin = () => {
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const adminExists = users.some((u) => u.username === "admin");
            if (!adminExists) {
                users.push({
                    username: "admin",
                    password: "Admin@666",
                    role: "admin",
                });
                localStorage.setItem("users", JSON.stringify(users));
            }
        };

        initializeAdmin();
        
        const loginData = {username: values.username, password: values.password}

        axios.post("https://generateapi.techsnack.online/api/login", loginData, {
            headers: {Authorization: token, "Content-Type": "application/json" }
        })
        .then((res) => {
            if(res.status === 200 || res.status === 201){
                // Get registered users from localStorage
                const users = JSON.parse(localStorage.getItem("users")) || [];
                const user = users.find(
                    (u) => u.username === values.username && u.password === values.password
                );

                if (user) {
                    console.log("/* Login Data */");
                    console.log("POST response: ", res.data);

                    // Successful login
                    localStorage.setItem("authToken", "demo-token"); // fake token
                    localStorage.setItem("role", user.role || "user");
                    ShowSnackbar("Login Successful !", "success");

                    resetForm();
                    // Redirect based on role
                    if(user.role === "admin") history.push("/admin");
                    else ShowSnackbar("Only Admin Can Access for Now !", "info");
                } else {
                    ShowSnackbar("Username or Password not Exists !", "info");
                }
            }
        })
        .catch((err) => {
            console.error("POST error: ", err);
            ShowSnackbar("Login Failed !", "error");
        })
    }

    const handleSubmit = (values, { resetForm }) => {
        postData(values, resetForm);
    };

    const fillForm = (username, password) => formikRef.current.setValues({ username, password });

    return (
        <>
            <Box className="container" 
                sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
                    flexDirection: "column", background: "linear-gradient(135deg, #faf7f5, #f3edea)", 
                    px: { xs: 2, sm: 0 }
                }}
            >
                <Paper elevation={0} className='form-container' 
                    sx={{ width: "100%", maxWidth: 350, p: { xs: 1, sm: 4 }, borderRadius: 4, 
                        background: "#ffffff", border: "1px solid #e7ded9", 
                        boxShadow: "0 10px 30px rgba(78,52,46,0.08)"
                    }}
                >
                    <Formik innerRef={formikRef} 
                        initialValues={initialValues}
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
                                    <Field name="username" placeholder="Enter Username" />
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

                                <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 1, 
                                        flexWrap: "wrap" 
                                    }}
                                >
                                    <Typography component={"span"}>
                                        Don&apos;t have an Account ?
                                    </Typography>
                                    <NavLink className="register-link" to="/register">Register</NavLink>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Paper>

                <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                    {/* <Button variant="contained" onClick={() => fillForm("DemoUser000", "DEmo@#666")} 
                        sx={{ mt: 3, textTransform: "none", background: "#9a3c1c", color: "#ffffff", 
                            borderRadius: 4 
                        }}
                    >
                        User Account :- Username: DemoUser000, Password: DEmo@#666
                    </Button> */}

                    <Button variant="contained" onClick={() => fillForm("admin", "Admin@666")} 
                        sx={{ mt: 3, textTransform: "none", background: "#9a3c1c", color: "#ffffff", 
                            borderRadius: 4 
                        }}
                    >
                        Admin Account :- Username: admin, Password: Admin@666
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export default LoginPage;