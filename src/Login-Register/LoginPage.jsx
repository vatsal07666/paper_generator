import React, { useRef, useState } from 'react';
import { Box, Button, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Field, Form, Formik } from 'formik';
import { NavLink, useHistory } from 'react-router-dom';
import { RiLockPasswordLine } from 'react-icons/ri';
import * as Yup from "yup";
import { useSnackbar } from '../Context/SnackbarContext';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { MdOutlineAttachEmail } from 'react-icons/md';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const{ ShowSnackbar } = useSnackbar();
    const history = useHistory();
    const formikRef = useRef();

    const initialValues = {email: '', password: ''};

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid Email*").required("Enter Email*"),
        password: Yup.string().required("Password is required*").min(8,"Password must be at least 8 characters")
                .matches(/[A-Z]/, "Password must contain at least one uppercase character")
                .matches(/[a-z]/, "Password must contain at least one lowercase character")
                .matches(/\d/, "Password must contain at least one number")
                .matches(/[!@#$%^&*()]/, "Password must contain at least one special character")
    })

    const token = "5wI8xsf3DqDSmYTX";

    const getData = (values, resetForm) => {
        const initializeAdmin = () => {
            const localUsers = JSON.parse(localStorage.getItem("users")) || [];
            const adminExists = localUsers.some((u) => u.email === "admin@example.com");
            if (!adminExists) {
                localUsers.push({
                    username: "admin",
                    password: "Admin@666",
                    email: "admin@example.com",
                    role: "admin",
                });
                localStorage.setItem("users", JSON.stringify(localUsers));
            }
        };

        initializeAdmin();

        axios.get("https://generateapi.techsnack.online/api/register", {
            headers: {Authorization: token, "Content-Type": "application/json" }
        })
        .then((res) => {
            if(res.status === 200 || res.status === 201){
                // Get registered users from localStorage
                const users = res.data?.Data;
                const localUsers = JSON.parse(localStorage.getItem("users")) || [];
                const allUsers = [...localUsers, ...users]
                const user = allUsers.find(
                    (u) => u.email === values.email && u.password === values.password
                );

                if (user) {
                    // Successful login
                    localStorage.setItem("authToken", "demo-token"); // fake token
                    localStorage.setItem("role", user.role || "user");
                    ShowSnackbar("Login Successful !", "success");
                    resetForm();

                    // Redirect based on role
                    if (user.role === "admin") history.push("/admin");
                    else history.push("/");
                } else {
                    ShowSnackbar("Email or Password not Exists !", "info");
                }
            }
        })
        .catch((err) => {
            console.error("GET error: ", err);
            ShowSnackbar("Login Failed !", "error");
        })
    }

    const handleSubmit = (values, { resetForm }) => {
        getData(values, resetForm);
    };

    const fillForm = (email, password) => {
        if (!formikRef.current) return;

        formikRef.current.setFieldValue("email", email);
        formikRef.current.setFieldValue("password", password);
    };

    return (
        <>
            <Box className="container" sx={{ flexDirection: "column", px: { xs: 2, sm: 0 } }}>
                <Paper elevation={0} className='form-container' sx={{ p: { xs: 1, sm: 4 } }}>
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
                                    <MdOutlineAttachEmail style={{ position: "absolute", left: 12, color: "gray", 
                                        alignSelf: "center", fontSize: "25px" }}
                                    />
                                    <Field name="email" type="email" placeholder="Enter Email" />
                                    {errors.email && touched.email && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.email}</div>}
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

                                <Button type="submit" fullWidth className='submit-button'>
                                    Login
                                </Button>

                                <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 1, 
                                        flexWrap: "wrap" 
                                    }}
                                >
                                    <Typography component={"span"}>
                                        Don&apos;t have an Account ?
                                    </Typography>
                                    <NavLink className="router-link" to="/register">Register</NavLink>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Paper>

                <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                    <Button variant="contained" onClick={() => fillForm("admin@example.com", "Admin@666")} 
                        sx={{ mt: 3, textTransform: "none", background: "#9a3c1c", color: "#ffffff", 
                            borderRadius: 4 
                        }}
                    >
                        Admin Account :- Email: admin@example.com, Password: Admin@666
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export default LoginPage;