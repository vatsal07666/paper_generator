import React from 'react'
import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import image from "../Images/IMAGE.png";

const HomePage = () => {
    return (
        <>
            <Box className="home" sx={{ display: "flex", justifyContent :"center", flexDirection: "column", flex: 1, 
                    minHeight: "100vh", backgroundImage: `url(${image})`, backgroundPosition: {xs: "top", sm: "center"},
                    backgroundRepeat: "no-repeat", backgroundSize: "cover"
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{display: "flex", flexDirection: "column", alignItems: "start", color: "#1e293b", 
                            gap: 3
                        }}
                    >
                        <Box sx={{display: "flex", flexDirection: "column"}}>
                            <Typography component={"span"} sx={{fontSize: {xs: "27px", sm: "45px"}}}> 
                                Premium Lifestyle Collection
                            </Typography>
                            <Typography component={"span"} sx={{fontSize: {xs: "27px", sm: "20px"}}}>
                                Discover curated products designed for modern living.
                            </Typography>
                        </Box>
                        
                        <Button component={Link} to={"/user/category"} variant="contained" type="button" 
                            sx={{ background: "#2563EB", color: "#fff", fontWeight: 600, textTransform: "none",
                                transition: "0.3s ease-in-out",
                                '&:hover': {background: "#1D4ED8", color: "#fff" }, 
                                "& .arrow": { transform: "translateX(-5px)", ml: 1,
                                    transition: "opacity 0.3s, transform 0.3s" 
                                },
                                "&:hover .arrow": { opacity: 1, transform: "translateX(0)" },
                                fontSize: {xs: "12px", sm: "14px"}
                            }}
                        >
                            Goto Categories
                            <ArrowForwardIcon className="arrow" fontSize="small" />
                        </Button>
                    </Box>
                </Container>
            </Box>
        </>
    )
}

export default HomePage 