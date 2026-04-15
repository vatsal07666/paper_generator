import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button } from "@mui/material";
import img1 from "../Images/Art_Image.png"
import img2 from "../Images/img2.jpg"
import img3 from "../Images/img3.jpg"
import img4 from "../Images/img4.jpg"
import { useNavigate } from "react-router-dom";

const UserPage = () => {
    const products = [
        {
            id: 1,
            name: "Wireless Headphones",
            price: "₹2,999",
            image: img1,
        },
        {
            id: 2,
            name: "Smart Watch",
            price: "₹4,499",
            image: img2,
        },
        {
            id: 3,
            name: "Bluetooth Speaker",
            price: "₹1,999",
            image: img3,
        },
        {
            id: 4,
            name: "Laptop Bag",
            price: "₹999",
            image: img4,
        },
    ];

    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("authToken");

    return (
        <Box sx={{ py: 5 }}>
            <Container maxWidth="lg">

                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold">
                        Welcome 👋
                    </Typography>
                    <Typography color="text.secondary">
                        Explore our latest products
                    </Typography>

                    <Button
                    variant="contained"
                    onClick={() => {
                        if (isLoggedIn) {
                        localStorage.clear();
                        navigate("/");
                        } else {
                        navigate("/log-in");
                        }
                    }}
                    >
                    {isLoggedIn ? "Logout" : "Login"}
                    </Button>
                </Box>

                {/* Products Grid */}
                <Grid container spacing={3}>
                    {products.map((item) => (
                        <Grid item xs={12} sm={6} md={3} key={item.id}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    transition: "0.3s",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                    },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="160"
                                    image={item.image}
                                    alt={item.name}
                                />

                                <CardContent>
                                    <Typography variant="h6">
                                        {item.name}
                                    </Typography>

                                    <Typography color="text.secondary" sx={{ mb: 1 }}>
                                        {item.price}
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: "none",
                                        }}
                                    >
                                        Add to Cart
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

            </Container>
        </Box>
    );
};

export default UserPage;