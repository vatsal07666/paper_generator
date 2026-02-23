import React, { useEffect, useState } from "react";
import { AppBar, Box, Button, Container, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, 
    ListItemText, Toolbar, Tooltip, Typography 
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { BiSolidShoppingBagAlt } from "react-icons/bi";
import { Link, NavLink, useHistory } from "react-router-dom";
import { useSnackbar } from "../../Context/SnackbarContext";

const drawerWidth = 240;

const Navbar = (props) => {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { ShowSnackbar } = useSnackbar();
    const history = useHistory();
    
    const navItems = [
        {name: 'Home', to: "/"},
    ];

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        history.push("/login");
        ShowSnackbar("Logged Out successful !", "success");
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Box sx={{ display: "flex", justifyContent :"center", alignItems: "center", gap: 1, my: 2, 
                    fontWeight: 600, color: "#1D4ED8"
                }}
            >
                <BiSolidShoppingBagAlt />
                <Typography component="span" sx={{fontWeight: 600, fontSize: "17px"}}>My Website</Typography>
            </Box>

            <Divider />

            <List>
                {navItems.map((item) => (
                    <ListItem key={item.name} component={Link} to={item.to} disablePadding sx={{color: "#475569"}}>
                        <ListItemButton sx={{ textAlign: 'center' }}>
                            <ListItemText>
                                {item.name}
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return(
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <CssBaseline />
                <AppBar component="nav" sx={{background: "#F0F7FF", borderBottom: "1px solid #d0dbe5"}} 
                    elevation={0}
                >
                    <Container maxWidth="lg">
                        <Toolbar disableGutters sx={{gap: 3}}>
                            <IconButton color="inherit" aria-label="open drawer" edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { sm: 'none' }, color: "#1D4ED8" }}
                            >
                                <MenuIcon />
                            </IconButton>

                            <Box sx={{ display: "flex", justifyContent: {xs: "center", sm: "flex-start"}, alignItems: "center", gap: 1, 
                                    fontSize: {xs: "18px", sm: "20px"}, flex: {xs: 1, sm: "none"}, color: "#1D4ED8"
                                }}
                            >
                                <BiSolidShoppingBagAlt />
                                <Typography component={Link} to={"/"}
                                    sx={{ fontWeight: 600, fontSize: {xs: "16px", sm: "20px"}, whiteSpace: "nowrap",
                                        textDecoration: "none", color: "#1D4ED8"
                                    }}
                                >
                                    My Website
                                </Typography>
                            </Box>

                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: "end", flex: 1, gap: 2 }}>
                                {navItems.map((item) => (
                                    <Tooltip key={item.name} title={item.name} slotProps={{
                                        tooltip: {
                                            sx: { letterSpacing: 2, fontSize: 12, background: "#e0efff", 
                                                color: "#1D4ED8"
                                            }
                                        }
                                    }}>
                                        <Button component={NavLink} to={item.to} exact
                                            sx={{ position: "relative", color: '#475569', textTransform: "none", 
                                                py: 0.5, fontSize: {xs: "20px", sm: "14px"}, transition: "0.2s ease-in-out",
                                                '&::after': { content: '""', position: "absolute", left: 0, bottom: 0,
                                                    width: "0%", height: "2px", backgroundColor: "#1D4ED8",
                                                    transition: "width 0.3s ease",
                                                },
                                                "&.active::after": {width: "100%"},
                                                '&:hover::after': { width: "100%" }, '&:hover': { background: "transparent"}
                                            }}
                                        >
                                            {item.name}
                                        </Button>
                                    </Tooltip>
                                ))}
                            </Box>

                            <Box>
                                <Button component={Link} to={"/login"} sx={{border: 1, borderRadius: 2, 
                                        background: "#1D4ED8", color: "#fff", px: 2, py: 0.5,
                                        textTransform: "none", transition: "0.3s ease-in-out", 
                                        '&:hover': { borderColor: "#ff0000", background: "#F0F7FF", 
                                            color: "#ff0000" },
                                        fontSize: {xs: "13px", sm: "15px"}, whiteSpace: "nowrap", marginLeft: 0,
                                        
                                    }}
                                    onClick={() => isLoggedIn ? handleLogout() : history.push("/login")}
                                >
                                    {isLoggedIn ? "Log out" : "Log in"}
                                </Button>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>

                <nav>
                    <Drawer container={container} variant="temporary" open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{ display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        {drawer}
                    </Drawer>
                </nav>
            </Box>
        </>
    )
}

export default Navbar;