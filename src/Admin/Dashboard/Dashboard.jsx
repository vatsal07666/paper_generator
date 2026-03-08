import { Box, Card, CardContent, Grid, IconButton, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useCallback, useEffect } from "react";
import { setSubject } from "../Subject/SubjectSlice";
import { setTopic } from "../Topic/TopicSlice";
import { MdOutlineTopic } from "react-icons/md";
import { setQuestion } from "../Questions/QuestionsSlice";
import { SlQuestion } from "react-icons/sl";
import { GiBookshelf } from "react-icons/gi";

const Dashboard = () => {
    const { list: subjects = [] } = useSelector((state) => state.subjectStore);
    const { list: topics = [] } = useSelector((state) => state.topicStore);
    const { list: questions = [] } = useSelector((state) => state.questionStore);

    const dispatch = useDispatch();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    /* ---------------- Calling api to Count the Length of all Sections ---------------- */
    const tokenSubject = "2xzYLLbk3VRezP5s";
    const tokenTopic = "7TDdOTQs88FIYRPd";
    const tokenQuestion = "5TirRDcDOTjoaVUS";

    const subjectCount = useCallback(() => {
        return axios.get("https://generateapi.techsnack.online/api/subject", {
            headers: { Authorization: tokenSubject },
        })
        .then((res) => dispatch(setSubject(res.data.Data)))
        .catch((err) => console.error("GET error: ", err));
    }, [dispatch]);

    const topicCount = useCallback(() => {
        return axios.get("https://generateapi.techsnack.online/api/topic", {
            headers: { Authorization: tokenTopic },
        })
        .then((res) => dispatch(setTopic(res.data.Data)))
        .catch((err) => console.error("GET error: ", err));
    }, [dispatch]);

    const questionCount = useCallback(() => {
        return axios.get("https://generateapi.techsnack.online/api/question", {
            headers: { Authorization: tokenQuestion },
        })
        .then((res) => dispatch(setQuestion(res.data.Data)))
        .catch((err) => console.error("GET error: ", err));
    }, [dispatch]);

    useEffect(() => {
        subjectCount();
        topicCount();
        questionCount();
    }, [subjectCount, topicCount, questionCount]);

    /* ---------------- Card Details ---------------- */
    const cards = [
        {
            icon: <GiBookshelf />,
            title: "Subjects",
            count: subjects?.length,
            path: "/admin/subject",
        },
        {
            icon: <MdOutlineTopic />,
            title: "Topics",
            count: topics?.length,
            path: "/admin/topic",
        },
        {
            icon: <SlQuestion />,
            title: "Questions",
            count: questions?.length,
            path: "/admin/question",
        },
    ];

    return (
        <>
            <Box sx={{ m: isMobile ? 0 : 2 }}>
                {/* Heading */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#4e342e" }}>Dashboard</Typography>
                </Box>

                {/* Card Grid */}
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                    {cards.map((item, index) => (
                        <Grid size={{ xs: 12, sm: 4 }} key={index} component={Link} to={item.path}
                            sx={{ textDecoration: "none" }}
                        >
                            <Card sx={{ width: "100%", borderRadius: 5, background: "rgba(255,255,255,0.65)",
                                    boxShadow: "0 12px 28px rgba(0,0,0,0.08)", backdropFilter: "blur(10px)",
                                    WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)",
                                    transition: "0.3s ease-in-out",
                                    "&:hover": { transform: "translateY(-6px)", boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                                        background: "rgba(255,255,255,0.6)",
                                    },
                                }}
                            >
                                <CardContent sx={{ display: "flex", flexDirection: "column" }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                                        <Typography gutterBottom variant="h6" component="div" sx={{ color: "#6d4c41" }}>
                                            {item.title}
                                        </Typography>
                                        <IconButton component={Paper} sx={{ p: 1.2, mb: 1, color: "#6d4c41",
                                                background: "#f1ebe7", boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                                                backdropFilter: "blur(6px)", fontSize: "20px", borderRadius: 3.5,
                                                transition: "0.3s ease-in-out",
                                                "&:hover": { background: "#6d4c41", color: "#e4e4e4" },
                                            }}
                                        >
                                            {item.icon}
                                        </IconButton>
                                    </Box>

                                    <Typography variant="h4" sx={{ color: "#4e342e", fontWeight: 600 }}>
                                        <CountUp delay={0.5} end={item.count ?? 0} duration={0.6} />
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
};

export default Dashboard;