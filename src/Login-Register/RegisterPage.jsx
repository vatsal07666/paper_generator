import React, { useState } from 'react'
import { Box, Button, IconButton, Paper, Tooltip, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { FaEye, FaEyeSlash, FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineAttachEmail } from "react-icons/md";
import { NavLink, useHistory } from 'react-router-dom';
import { useSnackbar } from '../Context/SnackbarContext';
import * as Yup from "yup";
import axios from 'axios';

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { ShowSnackbar } = useSnackbar();
    const history = useHistory();

    const initialValues = { username: '', email: '', password: '' };

    const validationSchema = Yup.object({
        username: Yup.string().required("Username is Required*"),
        email: Yup.string().email("Invalid Email*").required("Email is Required*"),
        password: Yup.string().required("Password is required*").min(8,"Password must be at least 8 characters")
                .matches(/[A-Z]/, "Password must contain at least one uppercase character")
                .matches(/[a-z]/, "Password must contain at least one lowercase character")
                .matches(/\d/, "Password must contain at least one number")
                .matches(/[!@#$%^&*()]/, "Password must contain at least one special character"),
    })

    const token = "vZt3CGeByg2P1RDS";
    
    const postData = (values, resetForm) => {
        const userData = { username: values.username, email: values.email, password: values.password }

        axios.post("https://generateapi.techsnack.online/api/register", userData, {
            headers: { Authorization: token }
        })
        .then((res) => {
            if(res.status === 200 || res.status === 201){
                console.log("POST response: ", res.data);
                resetForm();
                history.push("/");
                ShowSnackbar("Account Created Successfully !", "success");
            }
        })
        .catch((err) => {
            console.error("POST error: ", err);
            ShowSnackbar("Account Creation Failed !", "error");    
        })
    };

    const handleSubmit = (values, { resetForm }) => {
        postData(values, resetForm);
    }

    return (
        <>
            <Box className="container" 
                sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
                    background: "linear-gradient(135deg, #faf7f5, #f3edea)", px: { xs: 2, sm: 0 },
                    py: {xs: 4, sm: 2}
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
                        {({ errors, touched }) => (
                            <Form className='register-form'>
                                <Box textAlign="center" mb={2}>
                                    <Typography variant="h4" fontWeight={700} color="#4e342e">
                                        Paper Generator
                                    </Typography>

                                    <Typography variant="body2" color="#8d6e63">
                                        Create your account
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
                                            sx={{position: "absolute", alignSelf: "center", right: 0}}    
                                        >
                                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                                        </IconButton>
                                    </Tooltip>
                                    {errors.password && touched.password && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.password}</div>}
                                </Box>

                                <Button type='submit' fullWidth 
                                    sx={{ mt: 1, py: 1.2, fontWeight: 600, fontSize: "15px", borderRadius: 2,
                                        background: "#6d4c41", color: "#fff",
                                        "&:hover": { background: "#5d4037" }
                                    }}
                                >
                                    Create Account
                                </Button>

                                <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2, flexWrap: "wrap" }}>
                                    <Typography component={"span"}>
                                        Already have an Account ?
                                    </Typography>
                                    <NavLink className="register-link" to="/">Log in</NavLink>
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