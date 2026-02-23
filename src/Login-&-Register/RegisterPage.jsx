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

    const initialValues = { username: '', email: '', password: '', confirmpassword: '' };

    const validationSchema = Yup.object({
        username: Yup.string().required("Username is Required*"),
        email: Yup.string().email("Invalid Email*").required("Email is Required*"),
        password: Yup.string().required("Password is required*").min(8,"Password must be at least 8 characters")
                .matches(/[A-Z]/, "Password must contain at least one uppercase character")
                .matches(/[a-z]/, "Password must contain at least one lowercase character")
                .matches(/\d/, "Password must contain at least one number")
                .matches(/[!@#$%^&*()]/, "Password must contain at least one special character"),

        confirmpassword: Yup.string().required("Confirm Password is required*")
                .oneOf([Yup.ref("password"), null], "Passwords must match")
    })

    const token = "bHh95AE2A4VCWAQj";
    
    const postData = (values, resetForm) => {
        const data = {username: values.username, email: values.email, password: values.password,
            confirmpassword: values.confirmpassword
        };
        
        axios.post("https://generateapi.techsnack.online/api/Register", data, {
            headers: { Authorization: token, "Content-Type": "application/json" }
        })
        .then((res) => {
            console.log("POST response: ", res.data)
            if(res.status === 200 || res.status === 204){
                resetForm();
                history.push("/login");
                ShowSnackbar("Account Created Successfully !", "success");
            } else {
                ShowSnackbar("Login Failed !", "error");
            }
        })
        .catch((err) => console.log("POST error: ", err))
    }

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
                                    <Field name="confirmpassword" type={confirmPassword ? "text" : "password"} 
                                        placeholder="Enter Confirm Password" 
                                    />
                                    <Tooltip title={"View Password"}>
                                        <IconButton onClick={() => setConfirmPassword(!confirmPassword)}
                                            sx={{position: "absolute", alignSelf: "center", right: 5}}    
                                        >
                                            {confirmPassword ? <FaEye /> : <FaEyeSlash />}
                                        </IconButton>
                                    </Tooltip>
                                    {errors.confirmpassword && touched.confirmpassword && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.confirmpassword}</div>}
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