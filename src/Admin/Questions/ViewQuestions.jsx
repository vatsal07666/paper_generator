import React, { useCallback, useEffect } from "react";
import { Box, Typography, Checkbox, InputBase, Divider, useTheme, useMediaQuery, IconButton, Tooltip, Button,
    Paper
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { setQuestion, setSearchItem, setSelectedIds, setSelectedSubject, setSelectedTopic } from "../Questions/QuestionsSlice";
import { MdIndeterminateCheckBox } from "react-icons/md";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { setSubject } from "../Subject/SubjectSlice";
import { setTopic } from "../Topic/TopicSlice";

const ViewQuestions = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const history = useHistory();

    const { list: questions = [], searchItem, selectedIds = [], selectedSubject, selectedTopic } = useSelector((state) => state.questionStore);
    const { list: subjects = [] } = useSelector((state) => state.subjectStore);
    const { list: topics = [] } = useSelector((state) => state.topicStore);

    /* ---------------- Dropdown Options ---------------- */
    const subjectOptions = subjects.map((s) => ({ value: s.subjectName, label: s.subjectName }));

    const topicOptions = topics.filter((t) => selectedSubject ? t.subjectName === selectedSubject : true)
        .map((t) => ({ value: t.topicName, label: t.topicName }));

    /* ---------------- Filtering Logic ---------------- */
    const filteredQuestions = questions.filter((q) => {
        return (
            (!selectedSubject || q.subjectName === selectedSubject) &&
            (!selectedTopic || q.topicName === selectedTopic) &&
            (!searchItem ||
                [q.subjectName, q.topicName, q.marks, q.question].join(" ").toLowerCase()
                .includes(searchItem.toLowerCase()))
        );
    });

    /* ---------------- Checkbox Logic ---------------- */
    const handleSelect = (id) => {
        const updatedIds = selectedIds.includes(id)
            ? selectedIds.filter(item => item !== id)
            : [...selectedIds, id];
        
        dispatch(setSelectedIds(updatedIds));
    };

    /* ---------------- Select All Logic ---------------- */
    const handleSelectAll = (checked) => {
        const allIds = checked ? filteredQuestions.map(item => item._id) : [];
        dispatch(setSelectedIds(allIds));
    };

    /* ---------------- Create Paper Logic ---------------- */
    const handleCreatePaper = () => {
        const selectedQuestions = questions.filter(
            (q) => Array.isArray(selectedIds) && selectedIds.includes(q._id)
        );

        history.push("/admin/create-paper", {
            questions: selectedQuestions, subject: selectedSubject
        });
    };

    /* ---------------- Call Api to get Subjet, Topic & Question Data ---------------- */
    const subjectsToken = "2xzYLLbk3VRezP5s";
    const getSubjects = useCallback(() => {
        axios.get("https://generateapi.techsnack.online/api/subject", { headers: { Authorization: subjectsToken } })
        .then((res) => dispatch(setSubject(res.data.Data)))
        .catch((err) => console.error("Get Subjects error: ", err))
    }, [dispatch])

    const topicToken = "7TDdOTQs88FIYRPd";
    const getTopics = useCallback(() => {
        axios.get("https://generateapi.techsnack.online/api/topic", { headers: { Authorization: topicToken } })
        .then((res) => dispatch(setTopic(res.data.Data)))
        .catch((err) => console.error("Get Topics error: ", err))
    }, [dispatch])

    const questionToken = "5TirRDcDOTjoaVUS";
    const getQuestions = useCallback(() => {
        axios.get("https://generateapi.techsnack.online/api/question", { headers: { Authorization: questionToken } })
        .then((res) => dispatch(setQuestion(res.data.Data)))
        .catch((err) => console.error("Get Questions error: ", err))
    }, [dispatch])

    useEffect(() => {
        getSubjects();
        getTopics();
        getQuestions();
    }, [selectedSubject, selectedIds, getSubjects, getTopics, getQuestions]);

    return (
        <Box sx={{ m: isMobile ? 0 : 2 }}>
            {/* Heading */}
            <Box>
                <Typography component={"h1"} variant={isMobile ? "h6" : "h5"} 
                    sx={{ color: "#4e342e", fontWeight: 600 }}
                >
                    View Questions ({filteredQuestions.length})
                </Typography>
                <Typography variant="span" sx={{ color: "#888", mb: 3, fontSize: isMobile ? 14 : 16, 
                        fontWeight: 600 
                    }}
                >
                    Filter and select questions
                </Typography>
            </Box>

            {/* Filters Section */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, my: 3 }}>
                {/* Subject Filter */}
                <Box sx={{ flex: 1 }}>
                    <Select options={subjectOptions} placeholder="Filter by Subject"
                        value={ subjectOptions.find((opt) => opt.value === selectedSubject ) || null }
                        onChange={(option) => {
                            const value = option ? option.value : "";
                            dispatch(setSelectedSubject(value));
                            dispatch(setSelectedTopic("")); // reset topic
                        }}
                        isSearchable
                        isClearable
                    />
                </Box>

                {/* Topic Filter */}
                <Box sx={{ flex: 1 }}>
                    <Select options={selectedSubject ? topicOptions : []} 
                        placeholder="Filter by Topic"
                        value={ selectedSubject 
                            ? topicOptions.find((opt) => opt.value === selectedTopic) || null
                            : null
                        }
                        onChange={(option) => dispatch(setSelectedTopic(option ? option.value : ""))}
                        isSearchable
                        isClearable
                    />
                </Box>

                {/* Search */}
                <Box sx={{ position: "relative", border: "1px solid #ddd", borderRadius: 2, flex: 1,
                        py: 0.5, background: "#fff", boxShadow: "0 6px 16px rgba(0,0,0,0.1)"
                    }}
                >
                    <InputBase placeholder="Search Questions..." value={searchItem ?? ""}
                        onChange={(e) => dispatch(setSearchItem(e.target.value))}
                        sx={{ paddingLeft: "40px", width: "100%" }}
                    />
                    <SearchIcon sx={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                            color: "#888",
                        }}
                    />
                </Box>
            </Box>

            <Box>
                <Typography component={"h5"} variant="h5" sx={{ color: "#4e342e", fontWeight: 600 }}>
                    All Questions
                </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Selected Count */}
            <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", 
                    justifyContent: "space-between", flexWrap: "wrap" 
                }}
            >
                {/* Select All */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Checkbox checked={ filteredQuestions.length > 0 &&
                            selectedIds.length === filteredQuestions.length
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        sx={{ color: "#8d6e63", "&.Mui-checked": { color: "#6d4c41" } }} 
                    />
                    <Typography sx={{ color: "#4e342e", fontWeight: 600 }}>Select All</Typography>
                </Box>

                {/* Actions */}
                {selectedIds.length > 0 && (
                    <Box sx={{ mb: 2, display: "flex", flexDirection: isMobile ? "column" : "row", 
                            alignItems: "center", gap: 1, flexWrap: "wrap" 
                        }}
                    >
                        {/* Show the howmany question are selected */}
                        <Typography sx={{ color: "#4e342e", fontWeight: 600 }}> Selected Questions: </Typography>
                        <Typography fontSize={14} color="text.secondary">
                            { Object.entries(questions.filter(q => selectedIds.includes(q._id))
                                .reduce((acc, q) => { 
                                    acc[q.marks] = (acc[q.marks] || 0) + 1; 
                                    return acc; 
                                }, {}))
                                .map(([mark, count]) => `${mark} Marks: ${count}`).join(" | ")
                            }
                        </Typography>

                        {/* Unselect All Button */}
                        <Tooltip title={"Un-select all"} slotProps={{
                            tooltip: {
                                sx: { letterSpacing: 0.5, background: "#475569", color: "#fff" }
                            }
                        }}>
                            <IconButton size="small" onClick={() => dispatch(setSelectedIds([]))}
                                sx={{ fontSize: "22px", color: "#4e342e" }}    
                            >
                                <MdIndeterminateCheckBox />
                            </IconButton>
                        </Tooltip>

                        {/* Create Paper Button */}
                        <Button variant="contained" size="small" onClick={handleCreatePaper}
                            sx={{ background: "#6d4c41", color: "#fff", px: 3, py: 1, mb: isMobile ? 2 : 0, 
                                fontWeight: 600, "&:hover": { background: "#5d4037" }
                            }}
                        >
                            Create Paper
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Cards */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((item, index) => {
                        const isChecked = selectedIds.includes(item._id);

                        return (
                            <Box key={item._id} component={Paper} sx={{ display: "flex", flexDirection: isMobile ? "column" : "row",
                                    justifyContent: "space-between", alignItems: !isMobile && "center" , 
                                    gap: 1, padding: "5px 20px 5px 10px", borderRadius: 2
                                }}
                            >
                                {/* Question */}
                                <Typography variant="body1" fontWeight={600} display={"flex"} 
                                    alignItems={ isMobile ? "start" : "center"}
                                    flexDirection={isMobile && "column"}
                                >
                                    <Checkbox checked={isChecked} onChange={() => handleSelect(item._id)} 
                                        sx={{ color: "#8d6e63", "&.Mui-checked": { color: "#6d4c41" } }}    
                                    />
                                    {index + 1}. {" "} {item.question}
                                </Typography>

                                {/* Subject | Topic | Marks */}
                                <Typography fontSize={14} color="text.secondary">
                                    {item.subjectName} | {item.topicName} | {item.marks} Marks
                                </Typography>
                            </Box>
                        )
                    })
                ) : (
                    <Typography>No Questions Found</Typography>
                )}
            </Box>
        </Box>
    );
};

export default ViewQuestions;