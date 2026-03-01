import React, { useEffect } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, Dialog, DialogActions, 
    DialogContent, DialogTitle, Divider, InputBase, Paper, Tooltip, Typography, useMediaQuery, useTheme 
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addQuestion, deleteQuestion, resetDeleteState, resetFormValues, resetUIstate, setDeleteId, setDeleteOpen, 
    setEditId, setFormValues, setOpenForm, setQuestion, setSearchItem, updateQuestion 
} from '../Questions/QuestionsSlice';
import { Field, Form, Formik } from 'formik';
import SearchIcon from '@mui/icons-material/Search';
import { useSnackbar } from '../../Context/SnackbarContext';
import axios from 'axios';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { IoMdAdd } from 'react-icons/io';
import Select from "react-select";
import { MdOutlineViewInAr } from 'react-icons/md';
import { NavLink } from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AddQuestions = () => {
    const { list: questions = [], openForm, formValues, searchItem, deleteOpen, deleteId, editId } = useSelector((state) => state.questionStore);
    const { list: subjects = [] } = useSelector((state) => state.subjectStore);
    const { list: topics = [] } = useSelector((state) => state.topicStore);
    const dispatch = useDispatch();
    const { ShowSnackbar } = useSnackbar();
    const [expanded, setExpanded] = React.useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const validationSchema = Yup.object({
        subjectName: Yup.string().required("Subject Name is Required*"),
        topicName: Yup.string().required("Topic Name is Required*"),
        question: Yup.string().required("Question is Required*"),
        marks: Yup.number().typeError("Marks Must be Number").required("Marks is Required")
                .min(0, "Marks cannot be negative"),
    })

    const token = "5TirRDcDOTjoaVUS";
    
    const getData = () => {
        axios.get("https://generateapi.techsnack.online/api/question", {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("GET response: ", res.data);
            dispatch(setQuestion(res.data.Data));
        })
        .catch((err) => console.error("GET error: ", err));
    }

    useEffect(() => { 
        getData() 
        // eslint-disable-next-line 
    }, [])

    const postData = (values, resetForm) => {
        const data = { subjectName: values.subjectName, topicName: values.topicName, marks: Number(values.marks),
            question: values.question
        };

        axios.post("https://generateapi.techsnack.online/api/question", data, {
            headers: { Authorization: token, "Content-Type": "application/json" }
        })
        .then((res) => {
            console.log("POST response: ", res.data);
            if(res.status === 200 || res.status === 204){
                dispatch(addQuestion(res.data.Data));
                ShowSnackbar("Question Added Successfully !", "success");
                resetForm();
                dispatch(resetFormValues());
                dispatch(resetUIstate());
            }
        })
        .catch((err) => console.error("POST error: ", err));
    }

    const deleteData = () => {
        axios.delete(`https://generateapi.techsnack.online/api/question/${deleteId}`, {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("DELETE response: ", res.status);
            if(res.status === 200 || res.status === 204){
                dispatch(deleteQuestion(deleteId));
                dispatch(resetDeleteState());
                ShowSnackbar("Question Deleted Successfully !", "error");
            }
        })
        .catch((err) => {
            console.log("DELETE error: ", err);
        })
    }

    const patchData = (id, values, resetForm) => {
        axios.patch(`https://generateapi.techsnack.online/api/question/${id}`, values, {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("PATCH response: ", res.data);
            if(res.status === 200 || res.status === 204){
                dispatch(updateQuestion({_id: id, ...values}));
                ShowSnackbar("Question Updated Successfully !", "success");
                resetForm();
                dispatch(resetFormValues());
                dispatch(resetUIstate());
            }
        })
        .catch((err) => {
            console.error("PATCH response: ", err);
            toast.error("Update Failed !");
        })
    }

    const handleSubmit = (values, { resetForm }) => {
        if(editId !== null){
            patchData(editId, values, resetForm);
        } else {
            postData(values, resetForm);
        }
    }

    const handleCancel = (resetForm) => {
        resetForm();
        dispatch(resetUIstate());
        dispatch(resetFormValues());
    }

    const handleDelete = (item) => {
        dispatch(setDeleteOpen(true));
        dispatch(setDeleteId(item._id));
    }

    const handleEdit = (item) => {
        dispatch(setOpenForm(true));
        dispatch(setEditId(item._id));
        dispatch(setFormValues({
            subjectName: item.subjectName, topicName: item.topicName, marks: Number(item.marks), 
            question: item.question
        }));
    }

    /* ---------------- Search ---------------- */
    const filteredQuestion = questions.filter(l =>
        [l.subjectName, l.topicName, l.question].join(" ").toLowerCase().includes(searchItem.toLowerCase())
    )

    const subjectOptions = subjects.map((s) => ({ value: s.subjectName, label: s.subjectName }));

    const getFilteredTopics = (selectedSubject) => {
    if (!selectedSubject) {
        return topics.map((t) => ({ value: t.topicName, label: t.topicName }));
    }

    return topics.filter((t) => t.subjectName === selectedSubject).map((t) => ({
            value: t.topicName, label: t.topicName
        }));
    };

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <>
            <Box>
                {/* Heading & Add Question Button */}
                <Box sx={{display: "flex", flexDirection: {xs: "column", sm: "row"}, justifyContent: "space-between", 
                        alignItems: {xs: "flex-start", sm: "center"}
                    }}
                >
                    <Box>
                        <h1>Questions ({questions.length})</h1>
                        <Typography variant='span' sx={{color: "#888888", fontSize: "15px"}}>
                            List of all questions
                        </Typography>
                    </Box>
                    
                    <Button  onClick={() => dispatch(setOpenForm(true))}
                        sx={{background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)", color: "#fff", 
                            p: "8px 14px", borderRadius: 2, mt: {xs: 2, sm: 0}, whiteSpace: "none", 
                            textTransform: "none", "&:hover": { filter: "brightness(1.3)" }
                        }}
                        startIcon={<IoMdAdd />}
                    >
                        Add Question
                    </Button>
                </Box>

                {/* Question Form */}
                <Dialog open={openForm} sx={{ zIndex: 2000 }} maxWidth="md" fullWidth disableRestoreFocus
                    slotProps={{
                        backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" } }
                    }}
                >
                    <DialogTitle sx={{ fontWeight: 700 }}>
                        {editId !== null ? "Edit Question" : "Add New Question"}
                    </DialogTitle>

                    <Divider />
                
                    <DialogContent sx={{ mt: 1 }}>
                        <Formik initialValues={formValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {({errors, touched, isValid, dirty, resetForm, setFieldValue, values}) => (
                                <Form className="question-form">
                                    {/* Subject Name & Topic Name & Marks */}
                                    <Box sx={{ display: "flex", flexDirection: {xs: "column", sm: "row"}, 
                                            gap: 3, mb: 3 
                                        }}
                                    >
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                                            <label htmlFor="subjectName">Subject Name</label>                                            
                                            <Select options={subjectOptions} placeholder="Search and select subject"
                                                value={subjectOptions.find(
                                                    (option) => option.value === values.subjectName
                                                ) || null}
                                                onChange={(option) => setFieldValue("subjectName", option ? option.value : "")}
                                                isSearchable
                                                isClearable
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                            />
                                            {errors.subjectName && touched.subjectName && (
                                                <div style={{ color: "#ff0000" }}>{errors.subjectName}</div>
                                            )}
                                        </Box>

                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                                            <label htmlFor="topicName">Topic Name</label>                                            
                                            <Select options={getFilteredTopics(values.subjectName)} placeholder="Search and select topic"
                                                value={ getFilteredTopics(values.subjectName).find(
                                                        (option) => option.value === values.topicName
                                                    ) || null
                                                }
                                                onChange={(option) => setFieldValue("topicName", option ? option.value : "")}
                                                isSearchable
                                                isClearable
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                            />
                                            {errors.topicName && touched.topicName && (
                                                <div style={{ color: "#ff0000" }}>{errors.topicName}</div>
                                            )}
                                        </Box>

                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label htmlFor="marks">Marks</label>
                                            <Field name="marks" id="marks" type="number" placeholder="Enter Marks" />
                                            {errors.marks && touched.marks && <div style={{color: "#ff0000"}}>{errors.marks}</div>}
                                        </Box>
                                    </Box>

                                    {/* Question */}
                                    <Box sx={{ display: "flex", flexDirection: {xs: "column", sm: "row"}, 
                                            gap: 3, mb: 3 
                                        }}
                                    >
                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label htmlFor="question">Question</label>
                                            <Field name="question" id="question" as="textarea" placeholder="Write Question" />
                                            {errors.question && touched.question && <div style={{color: "#ff0000"}}>{errors.question}</div>}
                                        </Box>
                                    </Box>

                                    {/* Cancle & Submit Button */}
                                    <DialogActions>
                                        <Button onClick={() => handleCancel(resetForm)} sx={{ color: "#1e293b" }}>
                                            Cancel
                                        </Button>
                                        
                                        <Button type="submit" variant="contained"                
                                            sx={{ background: "#1e293b", "&:hover": { background: "#0f172a" } }}
                                            disabled={!isValid || !dirty}
                                        >
                                            {editId !== null ? "Update" : "Submit"}
                                        </Button>
                                    </DialogActions>
                                </Form>
                            )}
                        </Formik>
                    </DialogContent>
                </Dialog>

                <Box sx={{display: "flex", flexDirection: {xs: "column", sm: "row"}, justifyContent: "space-between", 
                        alignItems: {xs: "stretch", sm: "center"}, gap: {xs: 1, sm: 0}, my: 2
                    }}
                >
                    <Box sx={{mr: {xs: 0, sm: 2}}}>
                        <Button component={NavLink} to="/admin/viewQuestions" 
                            sx={{ borderRadius: 2, color: "#fff",
                                background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                                textTransform: "none", transition: "all 0.3s ease-in-out",
                                '&:hover': { filter: "brightness(1.3)" }
                            }}
                        >
                            <MdOutlineViewInAr size={20} />&nbsp; View Questions
                        </Button>
                    </Box>

                    {/* Search Field */}
                    <Box sx={{ position: "relative", borderRadius: 2, border: "1px solid #ddd",
                            width: { xs: "100%", sm: "60%", md: "50%" }, py: 0.5, my: 2, background: "#fff",
                            boxShadow: "0 6px 16px rgba(0,0,0,0.1)"
                        }}
                    >
                        <InputBase name="search" placeholder="Search Questions" value={searchItem ?? ""}
                            onChange={(e) => dispatch(setSearchItem(e.target.value))}
                            sx={{ paddingLeft: '40px', width: '100%', boxSizing: "border-box" }}
                        />
                        <SearchIcon sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)'}} />
                    </Box>
                </Box>

                {!isMobile ? (
                    <Box>
                        {filteredQuestion.length > 0 ? (
                            filteredQuestion.map((item, index) => (
                                <Accordion key={item._id ?? index} expanded={expanded === item._id}
                                    onChange={handleAccordionChange(item._id)}
                                    sx={{ mb: 1.5, borderRadius: 2, overflow: "hidden", border: "1px solid #e2e8f0",
                                        "&:before": { display: "none" }
                                    }}
                                >
                                    {/* ================= SUMMARY ================= */}
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}
                                        sx={{ background: index % 2 === 0 ? "#f8fafc" : "#ffffff",
                                            "&:hover": { backgroundColor: "#e9f5fd" }
                                        }}
                                    >
                                        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between",
                                                alignItems: "center", gap: 2, flexWrap: "wrap"
                                            }}
                                        >
                                            <Typography fontWeight={600}>{index + 1}. {item.question}</Typography>

                                            <Typography fontSize={14} color="text.secondary">
                                                {item.subjectName} | {item.topicName} | {item.marks} Marks
                                            </Typography>
                                        </Box>
                                    </AccordionSummary>

                                    {/* ================= DETAILS ================= */}
                                    <AccordionDetails sx={{ background: "#f9fafb" }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 2 }}>
                                            <Typography><strong>Subject:</strong> {item.subjectName} </Typography>

                                            <Typography><strong>Topic:</strong> {item.topicName} </Typography>

                                            <Typography><strong>Marks:</strong> {item.marks} </Typography>
                                        </Box>

                                        {/* ACTION BUTTONS */}
                                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                            {/* DELETE */}
                                            <Tooltip title="Delete">
                                                <Button sx={{  background: "#fff", color: "#ef4444",
                                                        "&:hover": { background: "#dc2626", color: "#fff" },
                                                        border: "1px solid #ff0000", textTransform: "none"
                                                    }}
                                                    onClick={() => handleDelete(item)}
                                                >
                                                    <RiDeleteBin6Line size={18} />&nbsp; Delete
                                                </Button>
                                            </Tooltip>

                                            {/* EDIT */}
                                            <Tooltip title="Edit">
                                                <Button sx={{ background: "#fff", color: "#2563eb",
                                                        "&:hover": { background: "#2563eb", color: "#fff" },
                                                        border: "1px solid #2563eb", textTransform: "none"
                                                    }}
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <FaEdit size={18} />&nbsp; Edit
                                                </Button>
                                            </Tooltip>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            ))
                        ) : (
                            <Paper sx={{ p: 3, textAlign: "center" }}> No Question Data Found </Paper>
                        )}
                    </Box>
                ) : (
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2}}>
                        {filteredQuestion.map((item, index) => (
                            <Card key={item._id ?? index}
                                sx={{ borderRadius: 3, boxShadow: 2, display: "flex", flexDirection: "column" }}
                            >
                                {/* CONTENT */}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2"><b>Question:</b> {item.question}</Typography>
                                    <Typography variant="body2"><b>Subject Name:</b> {item.subjectName}</Typography>
                                    <Typography variant="body2"><b>Topic Name:</b> {item.topicName}</Typography>
                                    <Typography variant="body2"><b>Marks:</b> {item.marks}</Typography>
                                </CardContent>

                                {/* ACTIONS — ALWAYS AT BOTTOM */}
                                <Box sx={{ display: "flex", justifyContent: "center", gap: 1, p: 2, mt: "auto" }}>
                                    <Button
                                        sx={{ background: "#fff", color: "#ef4444", border: 1, whiteSpace: "nowrap" }}
                                        onClick={() => dispatch(setDeleteOpen(true))}
                                    >
                                        <RiDeleteBin6Line />&nbsp; Delete
                                    </Button>

                                    <Button
                                        sx={{ background: "#fff", color: "#2563eb", border: 1, whiteSpace: "nowrap" }}
                                        onClick={() => handleEdit(item)}
                                    >
                                        <FaEdit />&nbsp; Edit
                                    </Button>
                                </Box>
                            </Card>
                        ))}
                    </Box>
                )}
            </Box>

            {/* Delete Button Dialog */}
            <Dialog open={deleteOpen} fullWidth onClose={() => dispatch(resetDeleteState())} 
                disableRestoreFocus
                slotProps={{
                    backdrop: {
                        sx: { backgroundColor: "rgba(0,0,0,0.35)",
                            backdropFilter: "blur(4px)"
                        }
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title"> Confirm Delete By Clicking Delete! </DialogTitle>
                
                <DialogActions>
                    <Button onClick={() => dispatch(resetDeleteState())} 
                        variant="contained" 
                        sx={{color: "#1e293b", background: "#fff", 
                            '&:hover': { boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.5)" }
                        }}
                    >
                        Cancle
                    </Button>

                    <Button variant="contained" className="agree-button" 
                        onClick={deleteData}
                        sx={{background: "#ef4444", color: "#fff", transition: "0.2s ease-in-out",
                            '&:hover': {background: "#fff", color: "#ff0000", 
                                boxShadow: "0 0 2px rgba(255, 0, 0, 1)"
                            }
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>    
            </Dialog>
        </>
    )
}

export default AddQuestions
