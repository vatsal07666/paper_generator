import React, { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Box, Typography, Divider, Button, TextField, Paper, useTheme, useMediaQuery, FormControl, Select, 
    MenuItem, 
} from "@mui/material";
import logo from "../../Images/university-college-academy.png";
import jsPDF from "jspdf";
import { IoIosArrowRoundBack } from "react-icons/io";

const CreatePaper = () => {
    const location = useLocation();
    const { questions = [], subject } = location.state || {};
    const [error, setError] = useState("");
    const exams = [ "Internal", "External" ];
    const [paperDetails, setPaperDetails] = useState({
        university: "ABC University",
        subject: subject || "",
        semester: "",
        examType: "",
        examDate: "",
        examDurationHours: "",
        examDurationMinutes: "",
        instructions: "Answer all questions.",
    });
    const [sections, setSections] = useState([]);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    {/* ---------------- Validation ---------------- */}
    const validateForm = () => {
        if (!paperDetails.university.trim()) return "University name is required.";
        if (!paperDetails.subject.trim()) return "Subject is required.";
        if (!paperDetails.semester.trim()) return "Semester is required.";
        if (!paperDetails.examType.trim()) return "Exam type is required.";

        if (!paperDetails.examDate) return "Exam date is required.";
        const today = new Date().toISOString().split("T")[0];
        if (paperDetails.examDate < today) return "Past dates are not allowed.";

        if (!paperDetails.examDurationHours || !paperDetails.examDurationMinutes)
            return "Exam Duration Hour and Minute are required.";

        if (paperDetails.examDurationHours < 0) return "Hours cannot be negative.";

        if (paperDetails.examDurationMinutes < 0 || paperDetails.examDurationMinutes > 59)
            return "Minutes must be between 0 and 59.";
        return null;
    };


   {/* ---------------- Set Sections When Pages Load ---------------- */}
    useEffect(() => {
        if (questions.length > 0) {

            // Group questions by marks
            const groupedByMarks = questions.reduce((acc, question) => {
                const marks = question.marks; // make sure each question has marks field

                if (!acc[marks]) {
                    acc[marks] = [];
                }

                acc[marks].push(question);
                return acc;
            }, {});

            // Sort marks ascending (2 → 5 → 10)
            const sortedMarks = Object.keys(groupedByMarks).map(Number).sort((a, b) => a - b);

            // Create sections dynamically (A, B, C...)
            const newSections = sortedMarks.map((marks, index) => ({
                section: String.fromCharCode(65 + index), // 65 = A
                marksPerQuestion: marks,
                questions: groupedByMarks[marks]
            }));

            setSections(newSections);
        }
    }, [questions]);

    {/* ---------------- Total Marks Logic ---------------- */}
    const totalMarks = sections.reduce(
        (sum, sec) => sum + sec.questions.length * sec.marksPerQuestion,
        0
    );

    {/* ---------------- PDF download Logic ---------------- */}
    const handleDownload = () => {
        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");

        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 15;
        let y = 15;

        const img = new Image();
        img.src = logo;
        img.onload = () => {
            {/* Logo */}
            pdf.addImage(img, "PNG", margin, y, 20, 20);

            {/* University Name */}
            pdf.setFontSize(16);
            pdf.setFont("helvetica", "bold");
            pdf.text(paperDetails.university, margin + 20, y + 12);

            {/* Date */}
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "bold");
            pdf.text(`Date: ${paperDetails.examDate}`, pageWidth - margin, y + 12, { align: "right" });
            y += 25;

            {/* Divider Line */}
            pdf.setLineWidth(0.5);
            pdf.line(margin, y, pageWidth - margin, y);
            y += 10;

            {/* Subject, Semester & Exam Type */}
            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.text(`Subject: ${paperDetails.subject}`, margin, y);
            pdf.text(`Semester: ${paperDetails.semester}`, 100, y);
            pdf.text(`Exam Type: ${paperDetails.examType}`, pageWidth - margin, y, { align: "right" });
            y += 10;

            {/* Time Duration */}
            pdf.setFont("helvetica", "bold");
            pdf.text(`Time: ${paperDetails.examDurationHours || 0}h ${paperDetails.examDurationMinutes || 0}m`, 
                margin, y
            );
            pdf.text(`Total Marks: ${totalMarks}`, pageWidth - margin, y, { align: "right" });

            y += 10;

            {/* Divider Line */}
            pdf.setLineWidth(0.2);
            pdf.line(margin, y, pageWidth - margin, y);
            y += 10;

            {/* Introduction */}
            pdf.setFont("helvetica", "bold");
            pdf.text("Instructions:", margin, y);
            y += 7;
            pdf.setFont("helvetica", "normal");
            const instructions = pdf.splitTextToSize(paperDetails.instructions, pageWidth - 2 * margin);
            pdf.text(instructions, margin, y);
            y += instructions.length * 7 + 5;

            {/* Divider Line */}
            pdf.setLineWidth(0.5);
            pdf.line(margin, y, pageWidth - margin, y);
            y += 10;

            // Dynamic sections
            pdf.setFontSize(12);
            sections.forEach((sec) => {
                pdf.setFont("helvetica", "bold");
                pdf.text(`Section ${sec.section} (Each Question ${sec.marksPerQuestion} marks)`, margin, y);
                y += 7;
                pdf.setFont("helvetica", "normal");

                sec.questions.forEach((q, idx) => {
                    const text = `${idx + 1}. ${q.question}`;
                    const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);

                    if (y + lines.length * 7 > pageHeight - 20) {
                        pdf.addPage();
                        y = 15;
                    }

                    pdf.text(lines, margin + 5, y);
                    y += lines.length * 7 + 3;
                });

                y += 5;
            });

            {/* Page */}
            if (y + 15 > pageHeight) {
                pdf.addPage();
                y = 15;
            }

            {/* Footer */}
            pdf.setFont("helvetica", "bold");
            pdf.text("------- Best of Luck -------", pageWidth / 2, pageHeight - 15, { align: "center" });

            {/* Save Paper */}
            const savedPaper = {
                id: Date.now(),
                paperDetails,
                sections,
                totalMarks,
            };

            const existingPapers = JSON.parse(localStorage.getItem("savedPapers")) || [];

            existingPapers.push(savedPaper);

            localStorage.setItem("savedPapers", JSON.stringify(existingPapers));

            pdf.save(`${paperDetails.subject || "Question_Paper"}.pdf`);
        };
    };

    {/* ---------------- Clear Paper Details Logic ---------------- */}
    const handleClearPaper = () => {
        setPaperDetails({
            university: "ABC University",
            subject: "",
            semester: "",
            examType: "",
            examDate: "",
            examDurationHours: "",
            examDurationMinutes: "",
            instructions: "Answer all questions.",
        });

        setSections([]);
        setError("");
    };

    {/* ---------------- Semester States ---------------- */}
    const sems = [ "1", "2", "3", "4", "5", "6", "7", "8" ];

    return (
        <Box>
            {/* Validation */}
            {error && ( <Typography color="error" fontWeight={500} mb={2} align="right"> {error} </Typography> )}
            
            {/* View Questions, Clear & Download Button */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                    flexDirection: isMobile ? "column" : "row"
                }}
            >
                {/* Goto View Question Button */}
                <Box>
                    <Button component={NavLink} to="/admin/view-questions" 
                        sx={{background: "#334155", color: "#fff", mb: 3, borderRadius: 2,
                            "&:hover": { filter: "brightness(1.3)" }, textTransform: "none"
                        }}
                    >
                        <IoIosArrowRoundBack size={30} /> 
                        <Typography component={"span"} sx={{fontSize: "15px", fontWeight: 600}}>
                            Go To View Questions
                        </Typography>
                    </Button>
                </Box>

                {/* Clear & Download Button */}
                <Box sx={{ display: "flex", justifyContent: isMobile && "center", alignItems: "center",
                        flexDirection: isMobile ? "column" : "row", gap: isMobile ? 0 : 2
                    }}
                >
                    {/* Clear Button */}
                    <Button variant="outlined" color="error" onClick={handleClearPaper}
                        sx={{ mb: 3, textTransform: "none" }}
                    >
                        Clear Paper
                    </Button>

                    {/* Download Button */}
                    <Button variant="contained" onClick={handleDownload}
                        sx={{ background: "#334155", color: "#fff", mb: 3, textTransform: "none" }}
                    >
                        Download PDF
                    </Button>
                </Box>
            </Box>

            <Box component={Paper} elevation={5}
                sx={{ width: { xs: "100%", sm: "90%", md: 794 }, minHeight: "1123px", margin: "0 auto", 
                    padding: { xs: 3, sm: 6 }, backgroundColor: "#fff", display: "flex", 
                    flexDirection: "column", boxSizing: "border-box"
                }}
            >
                {/* University & Date Section */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2,
                        flexDirection: isMobile ? "column" : "row", gap: 2
                    }}
                >
                    {/* University Field */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <img src={logo} alt="University-logo"
                            style={{ width: 50, height: 50, objectFit: "contain" }} 
                        />
                        <TextField variant="standard" value={paperDetails.university || ""}
                            onChange={(e) => setPaperDetails({ ...paperDetails, university: e.target.value })} 
                        />
                    </Box>

                    {/* Date Field */}
                    <TextField type="date" variant="standard" value={paperDetails.examDate || ""}
                        onChange={(e) => setPaperDetails({ ...paperDetails, examDate: e.target.value })} 
                    />
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Subject & Exam Type Section */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3,
                        flexDirection: isMobile ? "column" : "row", gap: 2
                    }}
                >
                    {/* Subject Field */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography component={"span"} fontWeight={600}>Subject: </Typography>
                        <TextField variant="standard" value={paperDetails.subject || ""} sx={{ pl: 1 }} />
                    </Box>

                    {/* Exam Type Field */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography fontWeight={600}>Exam:</Typography>

                        <FormControl variant="standard" sx={{ width: 150, pl: 1 }}>
                            <Select value={paperDetails.examType || ""}
                                onChange={(e) => setPaperDetails({ ...paperDetails, examType: e.target.value })}
                            >
                                <MenuItem value="">None</MenuItem>
                                {exams.map((ex) => <MenuItem key={ex} value={ex}> {ex} </MenuItem> )}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {/* Semester Field Section */}
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Typography component={"span"} fontWeight={600}>Semester: </Typography>
                    <FormControl variant="standard" sx={{ width: 50, textAlign: "center", pl: 1 }}>
                        <Select value={paperDetails.semester || ""}
                            onChange={(e) => setPaperDetails({ ...paperDetails, semester: e.target.value })}
                        >
                            {sems.map((s) => <MenuItem key={s} value={s}> {s} </MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Time and Total Marks Section */}
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center",
                        flexDirection: isMobile ? "column" : "row", mb: 2, gap: 2 
                    }}
                >
                    <Box display="flex" alignItems="center" flexWrap={"wrap"} gap={1}>
                        <b>Time Duration :</b>
                        <TextField type="number" variant="standard" value={paperDetails.examDurationHours || ""}
                            onChange={(e) =>
                                setPaperDetails({ ...paperDetails, examDurationHours: e.target.value })
                            }
                            sx={{ width: 40, mx: 0.5 }}
                        /> Hours

                        <TextField type="number" variant="standard" value={paperDetails.examDurationMinutes || ""}
                            onChange={(e) =>
                                setPaperDetails({ ...paperDetails, examDurationMinutes: e.target.value })
                            }
                            sx={{ width: 40, mx: 0.5 }}
                        /> Minutes
                    </Box>

                    {/* Total Marks Field */}
                    <Typography><b>Total Marks:</b> {totalMarks}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Instructions Section */}
                <Box>
                    <Typography fontWeight={600}>Instructions:</Typography>

                    <TextField variant="standard" multiline fullWidth rows={2}
                        value={paperDetails.instructions || ""}
                        onChange={(e) => setPaperDetails({ ...paperDetails, instructions: e.target.value })} 
                    />
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Dynamic Sections Preview */}
                {sections.map((sec) => (
                    <Box key={sec.section} sx={{ mb: 3 }}>
                        <Typography fontWeight={600}>
                            Section {sec.section} (Each Question {sec.marksPerQuestion} marks)
                        </Typography>

                        {sec.questions.map((q, idx) => (
                            <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", ml: 2,
                                    flexDirection: isMobile ? "column" : "row"
                                }}
                            >
                                <Typography>{idx + 1}. {q.question}</Typography>
                                <Typography sx={{ textAlign: isMobile && "right" }}>({sec.marksPerQuestion})</Typography>
                            </Box>
                        ))}
                    </Box>
                ))}

                {/* Footer */}
                <Box mt={6}>
                    <Divider sx={{ mb: 3 }} />
                    <Typography align="center" fontWeight={600}>------- Best of Luck -------</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default CreatePaper;