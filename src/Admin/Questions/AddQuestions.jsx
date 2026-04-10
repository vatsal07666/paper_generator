import React, { useCallback, useEffect, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, Dialog, DialogActions, 
    DialogContent, DialogTitle, Divider, InputBase, Paper, Typography, useMediaQuery, useTheme 
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addQuestion, deleteQuestion, resetDeleteState, resetFormValues, resetUIstate, setDeleteId, 
    setDeleteOpen, setEditId, setFormValues, setOpenForm, setQuestion, setSearchItem, setSelectedSubject, 
    setSelectedTopic, updateQuestion 
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
import { setSubject } from '../Subject/SubjectSlice';
import { setTopic } from '../Topic/TopicSlice';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const AddQuestions = () => {
    const { list: questions = [], openForm, formValues, searchItem, deleteOpen, deleteId, editId,
        selectedSubject, selectedTopic
    } = useSelector((state) => state.questionStore);
    const { list: subjects = [] } = useSelector((state) => state.subjectStore);
    const { list: topics = [] } = useSelector((state) => state.topicStore);
    const dispatch = useDispatch();
    const { ShowSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    /* ---------------- Validation ---------------- */
    const validationSchema = Yup.object({
        subjectName: Yup.string().required("Subject Name is Required*"),
        topicName: Yup.string().required("Topic Name is Required*"),
        question: Yup.string().required("Question is Required*"),
        marks: Yup.number().typeError("Marks Must be Number").required("Marks is Required")
                .min(0, "Marks cannot be negative"),
    })

    /* ---------------- Call Api to get Subject & Tpic Data ---------------- */
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

    useEffect(() => {
        getSubjects();
        getTopics();
    }, [getSubjects, getTopics])

    const token = "5TirRDcDOTjoaVUS";
    
    /* ---------------- Get Question ---------------- */
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

    /* ---------------- Load Data ---------------- */
    useEffect(() => { 
        getData() 
        // eslint-disable-next-line 
    }, [])

    /* ---------------- Post/Save Question ---------------- */
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

    /* ---------------- Delete Question ---------------- */
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

    /* ---------------- Patch/Update/Edit Question ---------------- */
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

    /* ---------------- Submission Logic ---------------- */
    const handleSubmit = (values, { resetForm }) => {
        if(editId !== null){
            patchData(editId, values, resetForm);
        } else {
            postData(values, resetForm);
        }
    }

    /* ---------------- Cancle Logic ---------------- */
    const handleCancel = (resetForm) => {
        resetForm();
        dispatch(resetUIstate());
        dispatch(resetFormValues());
    }

    /* ---------------- Delete Logic ---------------- */
    const handleDelete = (item) => {
        dispatch(setDeleteOpen(true));
        dispatch(setDeleteId(item._id));
    }

    /* ---------------- Edit Logic ---------------- */
    const handleEdit = (item) => {
        dispatch(setOpenForm(true));
        dispatch(setEditId(item._id));
        dispatch(setFormValues({
            subjectName: item.subjectName, topicName: item.topicName, marks: Number(item.marks), 
            question: item.question
        }));
    }

    /* ---------------- Search/Filter Logic ---------------- */
    const filteredQuestions = questions.filter((q) => {
        return (
            (!selectedSubject || q.subjectName === selectedSubject) &&
            (!selectedTopic || q.topicName === selectedTopic) &&
            (!searchItem ||
                [q.subjectName, q.topicName, q.marks, q.question].join(" ").toLowerCase()
                .includes(searchItem.toLowerCase()))
        );
    });

    const subjectOptions = subjects.map((s) => ({ value: s.subjectName, label: s.subjectName }));
    const topicOptions = topics.filter((t) => selectedSubject ? t.subjectName === selectedSubject : true)
        .map((t) => ({ value: t.topicName, label: t.topicName }));

    const getFilteredTopics = (selectedSubject) => {
        if (!selectedSubject) {
            return topics.map((t) => ({ value: t.topicName, label: t.topicName }));
        }

        return topics.filter((t) => t.subjectName === selectedSubject).map((t) => ({
            value: t.topicName, label: t.topicName
        }));
    };

    /* ---------------- Accordion Open-Close Logic ---------------- */
    const handleAccordionToggle = (id) => setExpanded(prev => (prev === id ? null : id));

    return (
        <>
            <Box sx={{ m: isMobile ? 0 : 2 }}>
                {/* Heading & Add Question Button */}
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {/* Heading */}
                    <Box>
                        <Typography component={"h1"} variant={isMobile ? "h6" : "h5"} 
                            sx={{ color: "#4e342e", fontWeight: 600 }}
                        >
                            Questions ({questions.length})
                        </Typography>
                        <Typography variant='span' sx={{ color: "#888888", fontSize: isMobile ? 14 : 16,
                                fontWeight: 600
                            }}
                        >
                            List of all Questions
                        </Typography>
                    </Box>
                    
                    {/* Add Question Button */}
                    <Button  onClick={() => dispatch(setOpenForm(true))}
                        sx={{ background: "#6d4c41", color: "#fff", p: "8px 14px", borderRadius: 2, 
                            whiteSpace: "none", textTransform: "none", fontWeight: 600,
                            "&:hover": { background: "#5d4037" }
                        }}
                        startIcon={<IoMdAdd />}
                    >
                        {isMobile ? "Add" : "Add Question"}
                    </Button>
                </Box>

                {/* Question Form */}
                <Dialog open={openForm} sx={{ zIndex: 2000 }} maxWidth="md" fullWidth disableRestoreFocus
                    slotProps={{
                        backdrop: { 
                            sx: { backgroundColor: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" } 
                        }
                    }}
                >
                    {/* Form Title */}
                    <DialogTitle sx={{ fontWeight: 700 }}>
                        {editId !== null ? "Edit Question" : "Add New Question"}
                    </DialogTitle>

                    <Divider />
                
                    {/* Form Content */}
                    <DialogContent sx={{ mt: 1 }}>
                        {/* Form */}
                        <Formik initialValues={formValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {({errors, touched, isValid, dirty, resetForm, setFieldValue, values}) => (
                                <Form className="question-form">
                                    <Box sx={{ display: "flex", flexDirection: {xs: "column", sm: "row"}, 
                                            gap: 3, mb: 3 
                                        }}
                                    >
                                        {/* Subject Field */}
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                                            <label htmlFor="subjectName">Subject Name</label>                                            
                                            <Select options={subjectOptions} placeholder="Select Subject"
                                                value={subjectOptions.find(
                                                    (option) => option.value === values.subjectName
                                                ) || null}
                                                onChange={(option) => setFieldValue("subjectName", option ? option.value : "")}
                                                isSearchable
                                                isClearable
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                    placeholder: (base) => ({ ...base, fontSize: 14, }),
                                                }}
                                            />
                                            {errors.subjectName && touched.subjectName && (
                                                <div style={{ color: "#ff0000" }}>{errors.subjectName}</div>
                                            )}
                                        </Box>

                                        {/* Topic Field */}
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                                            <label htmlFor="topicName">Topic Name</label>                                            
                                            <Select options={values.subjectName ? getFilteredTopics(values.subjectName) : []} 
                                                placeholder="Select Topic"
                                                value={ getFilteredTopics(values.subjectName).find(
                                                        (option) => option.value === values.topicName
                                                    ) || null
                                                }
                                                onChange={(option) => setFieldValue("topicName", option ? option.value : "")}
                                                isSearchable
                                                isClearable
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                    placeholder: (base) => ({ ...base, fontSize: 14, }),
                                                }}
                                            />
                                            {errors.topicName && touched.topicName && (
                                                <div style={{ color: "#ff0000" }}>{errors.topicName}</div>
                                            )}
                                        </Box>

                                        {/* Marks Field */}
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
                                        <Button onClick={() => handleCancel(resetForm)} 
                                            sx={{ color: "#6d4c41", fontWeight: 600 }}
                                        >
                                            Cancel
                                        </Button>
                                        
                                        <Button type="submit" variant="contained"                
                                            sx={{ background: "#6d4c41", "&:hover": { background: "#5d4037" } }}
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

                {/* View Question Button */}
                <Box sx={{ mr: {xs: 0, sm: 2}, my: 3}}>
                    <Button component={NavLink} to="/admin/view-questions" 
                        sx={{ borderRadius: 2, color: "#fff", background: "#6d4c41", textTransform: "none", 
                            transition: "all 0.3s ease-in-out", "&:hover": { background: "#5d4037" }
                        }}
                    >
                        <MdOutlineViewInAr size={20} />&nbsp; View Questions
                    </Button>
                </Box>

                {/* Filters Section */}
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 3 }}>
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
                        <Select options={selectedSubject ? topicOptions : []} placeholder="Filter by Topic"
                            value={ subjectOptions 
                                ? topicOptions.find((opt) => opt.value === selectedTopic) || null
                                : null
                            }
                            onChange={(option) => dispatch(setSelectedTopic(option ? option.value : ""))}
                            isSearchable
                            isClearable
                        />
                    </Box>
                
                    {/* Search */}
                    <Box sx={{ position: "relative", border: "1px solid #e4e4e4", borderRadius: 2, flex: 1,
                            py: 0.5, background: "#fff", boxShadow: "0 4px 14px rgba(0,0,0,0.06)"
                        }}
                    >
                        <InputBase placeholder="Search Questions..." value={searchItem ?? ""}
                            onChange={(e) => dispatch(setSearchItem(e.target.value))}
                            sx={{ paddingLeft: "40px", width: "100%" }}
                        />
                        <SearchIcon sx={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", }}/>
                    </Box>
                </Box>

                {/* Question Data Shown */}
                {!isMobile ? (
                    <Box>
                        {filteredQuestions.length > 0 ? (
                            filteredQuestions.map((item, index) => (
                                <Accordion key={item._id ?? index} expanded={expanded === item._id}
                                    onChange={() => handleAccordionToggle(item._id)}
                                    sx={{ mb: 1.5, borderRadius: 2, overflow: "hidden", border: "1px solid #e2e8f0",
                                        "&:before": { display: "none" }
                                    }}
                                >
                                    {/* Summary */}
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}
                                        sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                                            "&:hover": { backgroundColor: "#f3edea" }
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

                                    {/* Question Details */}
                                    <AccordionDetails sx={{ background: "#f9fafb" }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 2 }}>
                                            <Typography><strong>Subject:</strong> {item.subjectName} </Typography>

                                            <Typography><strong>Topic:</strong> {item.topicName} </Typography>

                                            <Typography><strong>Marks:</strong> {item.marks} </Typography>
                                        </Box>

                                        {/* Action Buttons */}
                                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                            {/* Delete */}
                                            <Button sx={{ background: "#fff", color: "#ef4444", border: 1,
                                                    whiteSpace: "nowrap", textTransform: "none", fontWeight: 600,
                                                    "&:hover": { background: "#c62828", color: "#ffffff" }
                                                }}
                                                onClick={() => handleDelete(item)}
                                            >
                                                <RiDeleteBin6Line />&nbsp; Delete
                                            </Button>
        
                                            {/* Edit */}
                                            <Button sx={{ background: "#fff", color: "#6d4c41", border: 1,
                                                    whiteSpace: "nowrap", textTransform: "none", fontWeight: 600,
                                                    "&:hover": { background: "#6d4c41", color: "#fff" }
                                                }}
                                                onClick={() => handleEdit(item)}
                                            >
                                                <FaEdit />&nbsp; Edit
                                            </Button>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            ))
                        ) : (
                            <Paper sx={{ p: 3, textAlign: "center", borderRadius: 4 }}> 
                                <Box sx={{ width: "100%", display: "flex", flexDirection: "column",
                                        alignItems: "center", justifyContent: "center", py: 10, textAlign: "center",
                                        color: "#64748B"
                                    }} 
                                >
                                    {/* Icon */}
                                    <HelpOutlineIcon sx={{ fontSize: 100, color: "#cbd5e1", mb: 2 }} />
    
                                    {/* Title */}
                                    <Typography sx={{ fontSize: "22px", fontWeight: 600, color: "#1e293b" }} >
                                        No Questions Found
                                    </Typography>
    
                                    {/* Subtitle */}
                                    <Typography sx={{ mt: 1, fontSize: 14 }}>
                                        there aren’t any questions added yet.
                                    </Typography>
                                </Box>
                            </Paper>
                        )}
                    </Box>
                ) : (
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2}}>
                        {filteredQuestions.map((item, index) => (
                            <Card key={item._id ?? index}
                                sx={{ borderRadius: 3, boxShadow: 2, display: "flex", flexDirection: "column" }}
                            >
                                {/* Content */}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2"><b>Question:</b> {item.question}</Typography>
                                    <Typography variant="body2"><b>Subject Name:</b> {item.subjectName}</Typography>
                                    <Typography variant="body2"><b>Topic Name:</b> {item.topicName}</Typography>
                                    <Typography variant="body2"><b>Marks:</b> {item.marks}</Typography>
                                </CardContent>

                                {/* Actions */}
                                <Box sx={{ display: "flex", justifyContent: "center", gap: 1, p: 2, mt: "auto" }}>
                                    {/* Delete */}
                                    <Button
                                        sx={{ background: "#fff", color: "#ef4444", border: 1, whiteSpace: "nowrap" }}
                                        onClick={() => dispatch(setDeleteOpen(true))}
                                    >
                                        <RiDeleteBin6Line />&nbsp; Delete
                                    </Button>

                                    {/* Edit */}
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
                <DialogTitle id="alert-dialog-title" sx={{ fontSize: isMobile ? 17 : 18 }}> 
                    Confirm Delete By Clicking Delete! 
                </DialogTitle>
                
                <DialogActions>
                    <Button onClick={() => dispatch(resetDeleteState())} 
                        variant="contained" 
                        sx={{ color: "#6d4c41", background: "#ffffff", fontWeight: 600,
                            "&:hover": { border: 1, borderColor: "#6d4c41" },
                        }}
                    >
                        Cancle
                    </Button>

                    <Button variant="contained" className="agree-button" 
                        onClick={deleteData}
                        sx={{background: "#ef4444", color: "#fff", fontWeight: 600,
                            transition: "0.2s ease-in-out",
                            '&:hover': { background: "#fff", color: "#ff0000", 
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
