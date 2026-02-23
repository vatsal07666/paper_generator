import React, { useState } from 'react';
import { Box, Button, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Field, Form, Formik } from 'formik';
import { NavLink, useHistory } from 'react-router-dom';
import { FaRegUser } from 'react-icons/fa';
import { RiLockPasswordLine } from 'react-icons/ri';
import * as Yup from "yup";
import axios from 'axios';
import { useSnackbar } from '../Context/SnackbarContext';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const{ ShowSnackbar } = useSnackbar();
    const history = useHistory();

    const initialValues = {username: '', password: ''};

    const validationSchema = Yup.object({
        username: Yup.string().required("Username is Required*"),
        password: Yup.string().required("Password is required*").min(8,"Password must be at least 8 characters")
                .matches(/[A-Z]/, "Password must contain at least one uppercase character")
                .matches(/[a-z]/, "Password must contain at least one lowercase character")
                .matches(/\d/, "Password must contain at least one number")
                .matches(/[!@#$%^&*()]/, "Password must contain at least one special character")
    })

    const token = "pnsviLxBYpe7ggTu";

    const postData = (values, resetForm) => {
        const data = {username: values.username, password: values.password};

        axios.post("https://generateapi.techsnack.online/api/Login", data, {
            headers: { Authorization: token, "Content-Type": "application/json" }
        })
        .then((res) => {
            console.log("/* Login Data */");
            console.log("POST response: ", res.data);
           // Save auth token
            localStorage.setItem("authToken", res.data.token);

            // Save role
            const role = res.data.role || 
                (values.username === "admin" && values.password === "Admin@666" ? "admin" : "user");
            localStorage.setItem("role", role);

            resetForm();
            
            // Redirect based on role
            if (role === "admin") history.push("/admin");
            else history.push("/");
            ShowSnackbar("Login Successful !", "success");
        })
        .catch((err) => { 
            console.log("POST error: ", err); 
            ShowSnackbar("Login Failed !", "error"); 
        })
    }

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