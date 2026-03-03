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

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const{ ShowSnackbar } = useSnackbar();
    const history = useHistory();

    const initialValues = {username: '', password: ''};

    const validationSchema = Yup.object({
        username: Yup.string().required("Username or Email is Required*"),
        password: Yup.string().required("Password is required*").min(8,"Password must be at least 8 characters")
                .matches(/[A-Z]/, "Password must contain at least one uppercase character")
                .matches(/[a-z]/, "Password must contain at least one lowercase character")
                .matches(/\d/, "Password must contain at least one number")
                .matches(/[!@#$%^&*()]/, "Password must contain at least one special character")
    })

    const postData = (values, resetForm) => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const adminExists = users.some(
            (user) => (user.userName === "admin" && user.email === "admin666@gmail.com")
        );

        if(!adminExists){
            users.push({
                username: "admin",
                email: "admin666@gmail.com",
                password: "Admin@666",
                role: "admin"
            })
            localStorage.setItem("users", JSON.stringify(users));
        }

        const validUser = users.find(
            (user) =>
                (user.username === values.username || user.email === values.username) &&
                user.password === values.password
        );

        if (!validUser) {
            ShowSnackbar("Invalid Username or Password!", "error");
            return;
        }

        // Fake session token
        const fakeToken = "frontend-auth-token";

        localStorage.setItem("authToken", fakeToken);
        localStorage.setItem("role", validUser.role);
        localStorage.setItem("authUser", JSON.stringify(validUser));

        resetForm();
        ShowSnackbar("Login Successful!", "success");

        history.push(validUser === "user" ? "/" : "/admin");
    };

    const handleSubmit = (values, { resetForm }) => {
        postData(values, resetForm);
    }

    return (
        <>
            <Box className="container" sx={{ px: {xs: 2, md: 0} }}>
                <Paper elevation={0} className='form-container' sx={{p: { xs: 0.5, md: 1 }, borderRadius: 5}}>
                    <Formik initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({errors, touched}) => (
                            <Form className='login-form'>
                                <Box>
                                    <Typography component={"h3"} variant='h4' align='center' sx={{fontSize: "28px"}}>
                                        Log in
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

                                <Button type='submit' fullWidth sx={{ background: "#1E3A8A", color: "#fff",
                                    "&:hover": {background: "#1D4ED8"}
                                }}>
                                    Submit
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