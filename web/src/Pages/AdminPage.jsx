import { Box, Button, Card, CardContent, Container, IconButton, Typography } from "@mui/material";
import { FaBoxes, FaTruckLoading } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import CountUp from "react-countup";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("authToken");

    const cards = [
        { icon: <FaBoxes />, title: "Products", count: 120 },
        { icon: <MdCategory />, title: "Categories", count: 25 },
        { icon: <FaTruckLoading />, title: "Suppliers", count: 15 },
        { icon: <GrMoney />, title: "Sales", count: 320 },
    ];

    return (
        <Box sx={{ py: 5 }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h4">Dashboard</Typography>

                    <Button variant="contained"
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

                <Box sx={{ display: "flex", gap: 3 }}>
                    {cards.map((item, index) => (
                        <Card
                            key={index}
                            sx={{ width: "100%", borderRadius: 2, color: "#FFF",
                                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb)",
                                boxShadow: "0 10px 30px rgba(37, 99, 235, 0.3)",
                                transition: "0.3s ease-in-out",
                                "&:hover": { transform: "translateY(-6px)" },
                            }}
                        >
                            <CardContent sx={{ display: "flex", flexDirection: "column" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="h6"> {item.title} </Typography>

                                    <IconButton
                                        sx={{ p: 1.2, mb: 1, color: "#065fed", background: "#dce9ff",
                                            fontSize: "20px",
                                            "&:hover": { background: "#065fed", color: "#dce9ff" },
                                        }}
                                    >
                                        {item.icon}
                                    </IconButton>
                                </Box>

                                <Typography variant="h4">
                                    <CountUp end={item.count} duration={0.6} />
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default AdminPage;