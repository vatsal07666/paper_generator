import React, { useState } from 'react'
import { Box, Button, IconButton, Paper, Tooltip, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { FaEye, FaEyeSlash, FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdOutlineAttachEmail } from "react-icons/md";
import { NavLink, useHistory } from 'react-router-dom';
import { useSnackbar } from '../Context/SnackbarContext';
import * as Yup from "yup";
import axios from 'axios';

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(false);
    const { ShowSnackbar } = useSnackbar();
    const history = useHistory();

    const initialValues = { username: '', email: '', password: '', confirmPassword: '' };

    const validationSchema = Yup.object({
        username: Yup.string().required("Username is Required*"),
        email: Yup.string().email("Invalid Email*").required("Email is Required*"),
        password: Yup.string().required("Password is required*").min(8,"Password must be at least 8 characters")
                .matches(/[A-Z]/, "Password must contain at least one uppercase character")
                .matches(/[a-z]/, "Password must contain at least one lowercase character")
                .matches(/\d/, "Password must contain at least one number")
                .matches(/[!@#$%^&*()]/, "Password must contain at least one special character"),

        confirmPassword: Yup.string().required("Confirm Password is required*")
                .oneOf([Yup.ref("password"), null], "Passwords must match")
    })

    const token = "uL8hdyXEltvYldi8";
    
    const postData = (values, resetForm) => {
        axios.post("https://generateapi.techsnack.online/api/login-register", values, { 
                headers: { Authorization: token, "Content-Type": "application/json" }
            }
        )
        .then((res) => {
            console.log("User Data: ", res.data);
            // Get existing users
            const users = JSON.parse(localStorage.getItem("users")) || [];

            // Check if username already exists
            const userExists = users.find(
                (user) => (user.username === values.username || user.email === values.email)
            );

            if (userExists) {
                ShowSnackbar("Username or Email already exists!", "error");
                return;
            }

            // Save new user
            const newUser = {
                username: values.username,
                email: values.email,
                password: values.password,
                role: "user"
            };

            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));

            resetForm();
            ShowSnackbar("Account Created Successfully!", "success");
            history.push("/login");
        })
        .catch(() => ShowSnackbar("Registration Failed!", "error"));
    };

    const handleSubmit = (values, { resetForm }) => {
        postData(values, resetForm);
    }

    return (
        <>
            <Box className="container"  sx={{ px: {xs: 2, md: 0} }}>
                <Paper elevation={0} className='form-container' sx={{p: { xs: 0.5, md: 1 }, borderRadius: 5}}>
                    <Formik initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched }) => (
                            <Form className='register-form'>
                                <Box>
                                    <Typography component={"h3"} variant='h4' align='center' sx={{fontSize: "28px"}}>
                                        Register
                                    </Typography>
                                </Box>

                                <Box position="relative" sx={{ my: 4 }}>
                                    <FaRegUser style={{ position: "absolute", left: 12, color: "gray",
                                        alignSelf: "center", fontSize: "25px" }}
                                    />
                                    <Field name="username" placeholder="Enter Username" />
                                    {errors.username && touched.username && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.username}</div>}
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

                                <Box position="relative" sx={{ mb: 4 }}>
                                    <RiLockPasswordFill style={{ position: "absolute", left: 12, color: "gray", 
                                        alignSelf: "center", fontSize: "25px" }} 
                                    />
                                    <Field name="confirmPassword" type={confirmPassword ? "text" : "password"} 
                                        placeholder="Enter Confirm Password" 
                                    />
                                    <Tooltip title={"View Password"}>
                                        <IconButton onClick={() => setConfirmPassword(!confirmPassword)}
                                            sx={{position: "absolute", alignSelf: "center", right: 5}}    
                                        >
                                            {confirmPassword ? <FaEye /> : <FaEyeSlash />}
                                        </IconButton>
                                    </Tooltip>
                                    {errors.confirmPassword && touched.confirmPassword && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.confirmPassword}</div>}
                                </Box>

                                <Button type='submit' fullWidth sx={{ background: "#1E3A8A", color: "#fff", 
                                        "&:hover": { background: "#1D4ED8" }
                                    }}
                                >
                                    Create Account
                                </Button>

                                <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2, flexWrap: "wrap" }}>
                                    <Typography component={"span"}>
                                        Already have an Account ?
                                    </Typography>
                                    <NavLink className="register-link" to="/login">Log in</NavLink>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Paper>
            </Box>
        </>
    )
}

export default RegisterPage