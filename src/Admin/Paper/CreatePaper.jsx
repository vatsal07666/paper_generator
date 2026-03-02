import React, { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Box, Typography, Divider, Button, TextField, Paper } from "@mui/material";
import logo from "../../university-college-academy.png";
import jsPDF from "jspdf";
import { IoIosArrowRoundBack } from "react-icons/io";

const CreatePaper = () => {
    const location = useLocation();
    const { questions = [], subject } = location.state || {};
    const [error, setError] = useState("");

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
    
    const validateForm = () => {
        if (!paperDetails.university.trim()) return "University name is required.";
        if (!paperDetails.subject.trim()) return "Subject is required.";
        if (!paperDetails.semester.trim()) return "Semester is required.";
        if (!paperDetails.examType.trim()) return "Exam type is required.";
        if (!paperDetails.examDate) return "Exam date is required.";

        if (!paperDetails.examDurationHours || !paperDetails.examDurationMinutes) {
            return "Exam Duration Hour and Minute are required.";
        }
        return null;
    };

    const [sections, setSections] = useState([]);

    // set sections when questions load
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
            const sortedMarks = Object.keys(groupedByMarks)
                .map(Number)
                .sort((a, b) => a - b);

            // Create sections dynamically (A, B, C...)
            const newSections = sortedMarks.map((marks, index) => ({
                section: String.fromCharCode(65 + index), // 65 = A
                marksPerQuestion: marks,
                questions: groupedByMarks[marks]
            }));

            setSections(newSections);
        }
    }, [questions]);

    const totalMarks = sections.reduce(
        (sum, sec) => sum + sec.questions.length * sec.marksPerQuestion,
        0
    );

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
            pdf.addImage(img, "PNG", margin, y, 20, 20);

            pdf.setFontSize(16);
            pdf.setFont("helvetica", "bold");
            pdf.text(paperDetails.university, margin + 20, y + 12);

            pdf.setFontSize(12);
            pdf.setFont("helvetica", "bold");
            pdf.text(`Date: ${paperDetails.examDate}`, pageWidth - margin, y + 12, { align: "right" });
            y += 25;

            pdf.setLineWidth(0.5);
            pdf.line(margin, y, pageWidth - margin, y);
            y += 10;

            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.text(`Subject: ${paperDetails.subject}`, margin, y);
            pdf.text(`Semester: ${paperDetails.semester}`, 100, y);
            pdf.text(`Exam Type: ${paperDetails.examType}`, pageWidth - margin, y, { align: "right" });
            y += 10;

            pdf.setFont("helvetica", "bold");
            pdf.text(`Time: ${paperDetails.examDurationHours || 0}h ${paperDetails.examDurationMinutes || 0}m`, 
                margin, y
            );
            pdf.text(`Total Marks: ${totalMarks}`, pageWidth - margin, y, { align: "right" });

            y += 10;

            pdf.setLineWidth(0.2);
            pdf.line(margin, y, pageWidth - margin, y);
            y += 10;

            pdf.setFont("helvetica", "bold");
            pdf.text("Instructions:", margin, y);
            y += 7;
            pdf.setFont("helvetica", "normal");
            const instructions = pdf.splitTextToSize(paperDetails.instructions, pageWidth - 2 * margin);
            pdf.text(instructions, margin, y);
            y += instructions.length * 7 + 5;

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

            if (y + 15 > pageHeight) {
                pdf.addPage();
                y = 15;
            }

            pdf.setFont("helvetica", "bold");
            pdf.text("------- Best of Luck -------", pageWidth / 2, pageHeight - 15, { align: "center" });

            pdf.save(`${paperDetails.subject || "Question_Paper"}.pdf`);
        };
    };

    return (
        <Box p={4}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Button variant="contained" onClick={handleDownload}
                        sx={{ background: "#334155", color: "#fff", mb: 3 }}
                    >
                        Download PDF
                    </Button>
                    {error && ( <Typography color="error" fontWeight={500} mb={2}> {error} </Typography> )}
                </Box>

                <Box>
                    <Button component={NavLink} to="/admin/viewQuestions" 
                        sx={{background: "#334155", color: "#fff", mb: 3, borderRadius: 2,
                            "&:hover": { filter: "brightness(1.3)" }
                        }}
                    >
                        <IoIosArrowRoundBack size={30} /> 
                        <Typography component={"span"} sx={{fontSize: "15px", fontWeight: 600}}>
                            Back To View Questions
                        </Typography>
                    </Button>
                </Box>
            </Box>

            <Box component={Paper} elevation={5}
                sx={{ width: { xs: "100%", sm: "90%", md: 794 }, minHeight: "1123px", margin: "0 auto", 
                    padding: { xs: 3, sm: 6 }, backgroundColor: "#fff", display: "flex", 
                    flexDirection: "column", boxSizing: "border-box"
                }}
            >
                {/* Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                        <img src={logo} alt="University-logo"
                            style={{ width: 50, height: 50, objectFit: "contain" }} 
                        />
                        <TextField variant="standard" value={paperDetails.university}
                            onChange={(e) => setPaperDetails({ ...paperDetails, university: e.target.value })} 
                        />
                    </Box>
                    <TextField type="date" variant="standard" value={paperDetails.examDate}
                        onChange={(e) => setPaperDetails({ ...paperDetails, examDate: e.target.value })} 
                    />
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Subject, Semester, Exam Type */}
                <Typography align="center" fontWeight={600} mb={1}>
                    <TextField variant="standard" value={paperDetails.subject}
                        onChange={(e) => setPaperDetails({ ...paperDetails, subject: e.target.value })} 
                    /> {" "}
                    ( Sem - {" "}
                        <TextField variant="standard" value={paperDetails.semester}
                            onChange={(e) => setPaperDetails({ ...paperDetails, semester: e.target.value })}
                            sx={{ width: 15 }} 
                        /> 
                    )
                </Typography>

                <Typography align="center" fontWeight={600}>
                    <TextField variant="standard" value={paperDetails.examType}
                        onChange={(e) => setPaperDetails({ ...paperDetails, examType: e.target.value })} 
                    />{" "}
                    Exam
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Time and Total Marks */}
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center" flexWrap={"wrap"}>
                        <b>Time Duration :</b>
                        <TextField type="number" variant="standard" value={paperDetails.examDurationHours}
                            onChange={(e) =>
                                setPaperDetails({ ...paperDetails, examDurationHours: e.target.value })
                            }
                            sx={{ width: 60, mx: 0.5 }}
                        /> Hours
                        <TextField type="number" variant="standard" value={paperDetails.examDurationMinutes}
                            onChange={(e) =>
                                setPaperDetails({ ...paperDetails, examDurationMinutes: e.target.value })
                            }
                            sx={{ width: 60, mx: 0.5 }}
                        /> Minutes
                    </Box>

                    <Typography><b>Total Marks:</b> {totalMarks}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Instructions */}
                <Typography fontWeight={600}>Instructions:</Typography>

                <TextField variant="standard" multiline fullWidth rows={2}
                    value={paperDetails.instructions}
                    onChange={(e) => setPaperDetails({ ...paperDetails, instructions: e.target.value })} 
                />

                <Divider sx={{ my: 2 }} />

                {/* Dynamic Sections Preview */}
                {sections.map((sec) => (
                    <Box key={sec.section} sx={{ mb: 3 }}>
                        <Typography fontWeight={600}>
                            Section {sec.section} (Each Question {sec.marksPerQuestion} marks)
                        </Typography>

                        {sec.questions.map((q, idx) => (
                            <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", ml: 2 }}>
                                <Typography>{idx + 1}. {q.question}</Typography>
                                <Typography>({sec.marksPerQuestion})</Typography>
                            </Box>
                        ))}
                    </Box>
                ))}

                <Box mt={6}>
                    <Divider sx={{ mb: 3 }} />
                    <Typography align="center" fontWeight={600}>------- Best of Luck -------</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default CreatePaper;