import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Checkbox, InputBase, Divider, useTheme, useMediaQuery, IconButton, 
    Tooltip,
    Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { setSearchItem } from "../Questions/QuestionsSlice";
import { MdIndeterminateCheckBox } from "react-icons/md";
import { useHistory } from "react-router-dom";

const ViewQuestions = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const history = useHistory();
    const [error, setError] = useState("");

    const { list: questions = [], searchItem } = useSelector((state) => state.questionStore);
    const { list: subjects = [] } = useSelector((state) => state.subjectStore);
    const { list: topics = [] } = useSelector((state) => state.topicStore);

    /* ---------------- Local Filter State ---------------- */
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);

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
            [q.subjectName, q.topicName, q.question].join(" ").toLowerCase()
            .includes(searchItem.toLowerCase()))
        );
    });

    /* ---------------- Checkbox Logic ---------------- */
    const handleSelect = (id) => {
        setSelectedIds((prev) =>
        prev.includes(id)
            ? prev.filter((item) => item !== id)
            : [...prev, id]
        );

        setError("");
    };

    const handleSelectAll = (checked) => {
        setSelectedIds(checked ? filteredQuestions.map((item) => item._id) : []);
        setError("");
    };
    
    const handleCreatePaper = () => {
        if (!selectedSubject) {
            setError("Please select a subject before creating the paper.");
            return;
        }

        const selectedQuestions = questions.filter((q) => selectedIds.includes(q._id));

        if (selectedQuestions.length === 0) {
            setError("Please select at least one question."); 
            return;
        }

        history.push("/admin/create-paper", {
            questions: selectedQuestions, subject: selectedSubject
        });
    };

    useEffect(() => {
        if (selectedSubject && selectedIds.length > 0) {
            setError("");
        }
    }, [selectedSubject, selectedIds]);

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Heading */}
            <Box>
                <Typography variant="h4" fontWeight={700} mb={1}>
                    View Questions ({filteredQuestions.length})
                </Typography>
                <Typography sx={{ color: "#888", mb: 3 }}>Filter and select questions</Typography>
            </Box>

            {/* Filters Section */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 3 }}>
                {/* Subject Filter */}
                <Box sx={{ flex: 1 }}>
                    <Select options={subjectOptions} placeholder="Filter by Subject"
                        value={ subjectOptions.find((opt) => opt.value === selectedSubject ) || null }
                        onChange={(option) => {
                            const value = option ? option.value : "";
                            setSelectedSubject(value);
                            setSelectedTopic(""); // reset topic
                            if (value) { setError("") }
                        }}
                        isSearchable
                        isClearable
                    />
                </Box>

                {/* Topic Filter */}
                <Box sx={{ flex: 1 }}>
                    <Select options={topicOptions} placeholder="Filter by Topic"
                        value={ topicOptions.find((opt) => opt.value === selectedTopic) || null }
                        onChange={(option) => setSelectedTopic(option ? option.value : "")}
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
                <Typography component={"h5"} variant="h5" fontWeight={600}>All Questions</Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {error && (
                <Typography color="error" fontWeight={500} mb={1} align="right"> {error} </Typography>
            )}

            {/* Selected Count */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {/* Select All */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Checkbox checked={
                            filteredQuestions.length > 0 &&
                            selectedIds.length === filteredQuestions.length
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)} 
                    />
                    <Typography fontWeight={600}>Select All</Typography>
                </Box>

                {selectedIds.length > 0 && (
                    <Box sx={{ mb: 1, display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography fontWeight={600}> Selected Questions: {selectedIds.length} </Typography>

                        {/* Unselect All Button */}
                        <Tooltip title={"Un-select all"} slotProps={{
                            tooltip: {
                                sx: { letterSpacing: 0.5, background: "#475569", color: "#fff" }
                            }
                        }}>
                            <IconButton size="small" onClick={() => {setSelectedIds([]); setError("")}}
                                sx={{ fontSize: "22px", color: "#1F51FF" }}    
                            >
                                <MdIndeterminateCheckBox />
                            </IconButton>
                        </Tooltip>


                        <Button variant="contained" size="small" onClick={handleCreatePaper}
                            sx={{ background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)", color: "#fff", 
                                px: 3, py: 1, "&:hover": { filter: "brightness(1.3)" }
                            }}
                        >
                            Create Paper
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Cards */}
            <Box sx={{ display: "grid",  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 3 }}>
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((item, index) => {
                        const isChecked = selectedIds.includes(item._id);

                        return (
                            <Card key={item._id}
                                sx={{ borderRadius: 3, boxShadow: 2, transition: "0.3s ease",
                                    backgroundColor: isChecked ? "#eff6ff" : "#fff",
                                }}
                            >
                                <CardContent>
                                    {/* Check Box */}
                                    <Box sx={{ display: "flex", justifyContent: "space-between",
                                            alignItems: "center", mb: 1,
                                        }}
                                    >
                                        <Checkbox checked={isChecked}
                                            onChange={() => handleSelect(item._id)}
                                        />
                                        <Typography variant="caption" sx={{ color: "#888" }}>
                                            #{index + 1}
                                        </Typography>
                                    </Box>

                                    {/* Question */}
                                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                                        {item.question}
                                    </Typography>

                                    <Typography variant="body2"> <b>Subject:</b> {item.subjectName} </Typography>

                                    <Typography variant="body2"> <b>Topic:</b> {item.topicName} </Typography>

                                    <Typography variant="body2"> <b>Marks:</b> {item.marks} </Typography>
                                </CardContent>
                            </Card>
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