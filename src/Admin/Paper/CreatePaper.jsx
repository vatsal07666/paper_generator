import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, TextField, Button, Divider } from "@mui/material";
import logo from "../../university-college-academy.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CreatePaper = () => {
    const location = useLocation();
    const { questions, subject } = location.state || {};
    const [error, setError] = useState("");

    const validateForm = () => {
        if (!paperDetails.university.trim()) {
            return "University name is required.";
        }

        if (!paperDetails.subject.trim()) {
            return "Subject is required.";
        }

        if (!paperDetails.semester.trim()) {
            return "Semester is required.";
        }

        if (!paperDetails.examType.trim()) {
            return "Exam type is required.";
        }

        if (!paperDetails.examDate) {
            return "Exam date is required.";
        }

        if (!paperDetails.startTime || !paperDetails.endTime) {
            return "Start and End time are required.";
        }

        if (paperDetails.startTime >= paperDetails.endTime) {
            return "End time must be after start time.";
        }

        return null; // valid
    };
    
    const [paperDetails, setPaperDetails] = useState({
        university: "ABC University",
        subject: subject || "",
        semester: "",
        examType: "",
        examDate: "",
        examTime: "",
        totalMarks: "",
        instructions: ""
    });
    
    if (!questions || questions.length === 0) {
        return <div>No Questions Selected</div>;
    }

    const totalMarks = questions.reduce(
        (sum, q) => sum + Number(q.marks || 0),
        0
    );

    const handleDownload = async () => {
        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");

        const input = document.getElementById("paper-preview");
        if (!input) return;

        const canvas = await html2canvas(input, { scale: 3, useCORS: true });

        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

        // Exact A4 size in mm
        const pageWidth = 210;
        const pageHeight = 297;

        // FORCE full page size (stretch to fit)
        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);

        pdf.save(`${paperDetails.subject || "Question_Paper"}.pdf`);
    };

    const sortedQuestions = [...questions].sort((a, b) => Number(a.marks) - Number(b.marks));

    return (
        <Box p={4}>
            {/* FORM SECTION */}
            <Typography variant="h5" mb={3}> Paper Details </Typography>

            <Box display="flex" gap={2} flexWrap="wrap" mb={4}>
                <TextField label="University" value={paperDetails.university} 
                    onChange={(e) => setPaperDetails({ ...paperDetails, university: e.target.value })}
                />

                <TextField label="Subject" value={paperDetails.subject}
                    onChange={(e) => setPaperDetails({ ...paperDetails, subject: e.target.value })}
                />

                <TextField label="Semester" value={paperDetails.semester}
                    onChange={(e) => setPaperDetails({ ...paperDetails, semester: e.target.value })}
                />

                <TextField label="Exam Type" value={paperDetails.examType}
                    onChange={(e) => setPaperDetails({ ...paperDetails, examType: e.target.value })}
                />

                <TextField type="time" label="Start Time" slotProps={{ inputLabel: { shrink: true } }}
                    value={paperDetails.startTime}
                    onChange={(e) => setPaperDetails({ ...paperDetails, startTime: e.target.value })}
                />

                <TextField type="time" label="End Time" slotProps={{ inputLabel: { shrink: true } }}
                    value={paperDetails.endTime}
                    onChange={(e) => setPaperDetails({ ...paperDetails, endTime: e.target.value })}
                />

                <TextField type="date" value={paperDetails.examDate}
                    onChange={(e) => setPaperDetails({ ...paperDetails, examDate: e.target.value })}
                />
            </Box>

            {error && ( <Typography color="error" fontWeight={500} mb={2}> {error} </Typography> )}

            <Button variant="contained" onClick={handleDownload}
                sx={{ background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)", color: "#fff", }}
            > 
                Download PDF 
            </Button>

            {/* PAPER PREVIEW */}
            <Box id="paper-preview" sx={{ width: "794px", minHeight: "1123px", margin: "40px auto",
                    padding: "60px", backgroundColor: "#fff", display: "flex", flexDirection: "column",
                    boxSizing: "border-box", boxShadow: "0 6px 16px rgba(0,0,0,0.1)"
                }}
            >
                <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography fontWeight={700} sx={{ display: "flex", alignItems: "center" }}> 
                            <img src={logo} alt="University-logo"
                                style={{ width: 50, height: 50, objectFit: "contain" }}
                            />
                            {paperDetails.university} 
                        </Typography>
                        <Typography alignSelf={"right"}><b>Date:</b> {paperDetails.examDate}</Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />

                    <Typography align="center" fontWeight={600} mb={1}> 
                        {paperDetails.subject} ( {`Sem - ${paperDetails.semester}`} ) 
                    </Typography>
                    
                    <Typography align="center" fontWeight={600}> {paperDetails.examType} Exam </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box display="flex" justifyContent="space-between">
                        <Typography><b>Time:</b> {paperDetails.startTime} - {paperDetails.endTime}</Typography>
                        <Typography><b>Total Marks:</b> {totalMarks}</Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography fontWeight={600}>Instructions:</Typography>

                    {paperDetails.instructions ? (
                        paperDetails.instructions.split("\n").map((line, index) => (
                            <Typography key={index}> {index + 1}. {line} </Typography>
                        ))
                    ) : (
                        <Typography>All questions are compulsory.</Typography>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {sortedQuestions.map((q, index) => (
                        <Box key={q._id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography mb={1}> <b>Q{index + 1}.</b> {q.question} </Typography>
                            <Typography fontWeight={600}> ({q.marks}) </Typography>
                        </Box>
                    ))}
                </Box>

                {/* FOOTER */}
                <Box mt={6}>
                    <Divider sx={{ mb: 3 }} />
                    <Typography align="center" fontWeight={600}> ------- Best of Luck ------- </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default CreatePaper;