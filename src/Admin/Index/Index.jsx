import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {  Box, Button, Container, CssBaseline, Drawer, Toolbar, Tooltip, Typography, useMediaQuery } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";
import { useHistory, useLocation } from 'react-router-dom';
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { useState } from 'react';
import { useRef } from 'react';
import { useSnackbar } from '../../Context/SnackbarContext';
import { useEffect } from 'react';
import { MdOutlineTopic } from "react-icons/md";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { GiBookshelf } from "react-icons/gi";

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open',
    })(({ theme, open }) => ({
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),

}));

const DesktopDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open'})(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const Items = [
    { name: "Dashboard", icon: <TbLayoutDashboardFilled />, to: "/admin" },
    { name: "Subject", icon: <GiBookshelf />, to: "/admin/subject" },
    { name: "Topic", icon: <MdOutlineTopic />, to: "/admin/topic" },
    { name: "Questions", icon: <MdOutlineQuestionAnswer />, to: "/admin/question" },
]

const Index = ({children}) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { ShowSnackbar } = useSnackbar();
    const history = useHistory();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();
    const prevPathRef = useRef(location.pathname);

    const handleDrawerOpen = () => {
        setOpen(prev => !prev);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    // ROLE CHECK
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const role = localStorage.getItem("role");

        if (!token || role !== "admin") {
            history.replace(role === "user" ? "/" : "/login");
        } else {
            setIsLoggedIn(true);
        }
    }, [history]);

    useEffect(() => {
        if(prevPathRef.current !== location.pathname){
            if (isMobile && open) {
                setOpen(false);
            }
            prevPathRef.current = location.pathname;
        }
    }, [location.pathname, isMobile, open]); // route change only

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        history.push("/login");
        ShowSnackbar("Logged Out successful !", "success");
    };

    if (!isLoggedIn) return null; // Prevent rendering before role check

    const DrawerContent = (
        <>
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            {Items.map((menu) => (
                <List key={menu.name}>
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <Tooltip title={menu.name} placement="right"
                            slotProps={{
                                tooltip: { sx: {background: "rgb(94, 104, 120)", color: "#ffffff", 
                                    letterSpacing: 2, fontWeight: 600 
                                }}
                            }}
                        >
                            <ListItemButton component={Link} to={menu.to} 
                                sx={{  mx: 1,  my: 0.5, borderRadius: "10px", 
                                    backgroundColor: location.pathname === menu.to ? "#e4e4e4": "transparent",
                                    "&:hover": { backgroundColor: "#d5d5d5" },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', fontSize: "23px", 
                                        transition: "0.2s ease", mr: open ? 3 : 'auto', color: "#1E293B", 
                                        ".MuiListItemButton-root:hover &": { color: "#1E293B" },
                                    }}
                                >
                                    {menu.icon}
                                </ListItemIcon>
                                <ListItemText primary={menu.name}
                                    sx={{ opacity: open ? 1 : 0, 
                                        color: location.pathname === menu.to ? "#1E293B" : "#475569",}}
                                />
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                </List>
            ))}
        </>
    )

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" open={!isMobile && open} 
                    sx={{ background: "#ffffff", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)" 
                    }}
                >
                    <Toolbar>
                        <IconButton color="inherit" aria-label="open drawer"
                            onClick={handleDrawerOpen} edge="start"
                            sx={{ mr: 2, display: { md: open ? "none" : "inline-flex" }, color: "#1E293B" }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Box sx={{width: "100%", display: "flex", justifyContent: "space-between", 
                                alignItems: "center"
                            }}
                        >
                            <Typography variant="h6" noWrap component="div" sx={{ color: "#1E293B" }}>
                                Paper Generator
                            </Typography>
                            <Button sx={{color: "#1E293B", border: "1px solid #1E293B", px: 2, py: 0.6,
                                    transition: "0.3s ease-in-out", textTransform: "none", fontSize: {xs: "13px", sm: "15px"},
                                    '&:hover': { background: "#1E293B", color: "#ffffff", border: 0, fontWeight: 700 },
                                }}
                                onClick={() => { isLoggedIn ? handleLogout() : history.push("/login") }}
                            >
                                {isLoggedIn ? "Log out" : "Log in"}
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Desktop Drawer */}
                {!isMobile ? (
                    <DesktopDrawer variant="permanent" open={open} 
                        sx={{ "& .MuiDrawer-paper": { backgroundColor: "#ffffff", color: "#0f172a",
                            borderRight: "1px solid #e2e8f0" },
                        }}
                    >
                        {DrawerContent}
                    </DesktopDrawer>
                ) : (
                    <Drawer variant="temporary" open={open} onClose={handleDrawerClose}
                        ModalProps={{ keepMounted: true }}
                        sx={{ '& .MuiDrawer-paper': { width: drawerWidth, height: '100vh' } }}
                    >
                        {DrawerContent}
                    </Drawer>
                )}

                <Box component="main" sx={{ minHeight: "100vh", flexGrow: 1, pt: 10, pb: 3, px: { xs: 2, sm: 0 },
                        background: "#F8FAFC",
                        transition: theme.transitions.create(['margin', 'width'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                        overflowX: 'hidden',   // allow horizontal scroll when content overflows
                    }}
                >
                    <Container maxWidth="lg">
                        {children}
                    </Container>
                </Box>
            </Box>
        </>
    )
}

export default Index