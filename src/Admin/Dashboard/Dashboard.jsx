import { Box, Card, CardContent, Grid, IconButton, Paper, Typography } from "@mui/material";
import { FaBoxes } from "react-icons/fa";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useCallback, useEffect } from "react";
import { setLanguage } from "../Language/LanguageSlice";
import { setTopic } from "../Topic/TopicSlice";
import { MdOutlineTopic } from "react-icons/md";
import { setQuestion } from "../Questions/QuestionsSlice";
import { MdOutlineQuestionAnswer } from "react-icons/md";

const Dashboard = () => {
    const { list: languages = [] } = useSelector((state) => state.languageStore);
    const { list: topics = [] } = useSelector((state) => state.topicStore);
    const { list: questions = [] } = useSelector((state) => state.questionStore);

    const dispatch = useDispatch();

    const tokenLanguage = "4MWMvdHWdPr8NGwM";
    const tokenTopic = "ROorKmyDQ65fmCmm";
    const tokenQuestion = "5xBkPzlxXM0mLYJX";

    const languageCount = useCallback(() => {
        return axios.get("https://generateapi.techsnack.online/api/language", {
            headers: { Authorization: tokenLanguage },
        })
        .then((res) => dispatch(setLanguage(res.data.Data)))
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
        languageCount();
        topicCount();
        questionCount();
    }, [languageCount, topicCount, questionCount]);

    const cards = [
        {
            icon: <FaBoxes />,
            title: "Languages",
            count: languages?.length,
            path: "/admin/language",
        },
        {
            icon: <MdOutlineTopic />,
            title: "Topics",
            count: topics?.length,
            path: "/admin/topic",
        },
        {
            icon: <MdOutlineQuestionAnswer />,
            title: "Questions",
            count: questions?.length,
            path: "/admin/question",
        },
    ];

    return (
        <>
            <Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h4">Dashboard</Typography>
                </Box>

                <Grid container spacing={{ xs: 2, sm: 3 }}>
                    {cards.map((item, index) => (
                        <Grid size={{ xs: 12, sm: 4 }} key={index} component={Link} to={item.path}
                            sx={{ textDecoration: "none" }}
                        >
                            <Card sx={{ width: "100%", borderRadius: 2, color: "#FFF",
                                    background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                                    boxShadow: "0 10px 30px rgba(37, 99, 235, 0.3)", transition: "0.3s ease-in-out",
                                    "&:hover": { transform: "translateY(-6px)" },
                                }}
                            >
                                <CardContent sx={{ display: "flex", flexDirection: "column" }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {item.title}
                                        </Typography>
                                        <IconButton component={Paper} sx={{ p: 1.2, mb: 1, color: "#1E293B",
                                                background: "#e4e4e4", transition: "0.3s ease-in-out", 
                                                fontSize: "20px",
                                                "&:hover": { background: "#1E293B", color: "#e4e4e4", 
                                                    fontWeight: 700 
                                                },
                                            }}
                                        >
                                            {item.icon}
                                        </IconButton>
                                    </Box>

                                    <Typography variant="h4">
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
