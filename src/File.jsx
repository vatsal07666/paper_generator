// {({errors, touched, isValid, dirty, resetForm, values, setFieldValue}) => (
//     <Form className="question-form">
//         <Box sx={{ display: "flex", flexDirection: {xs: "column", sm: "row"}, gap: 3, mb: 3 }}>

//             {/* Language Name */}
//             <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
//                 <label htmlFor="languageName">Language Name</label>
//                 <Field name="languageName" id="languageName" as="select"
//                     onChange={(e) => {
//                         setFieldValue("languageName", e.target.value);
//                         setFieldValue("topicName", ""); // 👈 Reset topic when language changes
//                     }}
//                 >
//                     <option value="" hidden>Select Language</option>
//                     {languages.map((l) => (
//                         <option key={l._id} value={l.languageName}>{l.languageName}</option>
//                     ))}
//                 </Field>
//                 {errors.languageName && touched.languageName && (
//                     <div style={{ color: "#ff0000" }}>{errors.languageName}</div>
//                 )}
//             </Box>

//             {/* Topic Name — filtered by selected language */}
//             <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
//                 <label htmlFor="topicName">Topic Name</label>
//                 <Field name="topicName" id="topicName" as="select">
//                     <option value="" hidden>Select Topic</option>
//                     {topics
//                         .filter((t) => t.languageName === values.languageName) // 👈 Key filter
//                         .map((t) => (
//                             <option key={t._id} value={t.topicName}>{t.topicName}</option>
//                         ))
//                     }
//                 </Field>
//                 {errors.topicName && touched.topicName && (
//                     <div style={{ color: "#ff0000" }}>{errors.topicName}</div>
//                 )}
//             </Box>

//             {/* Marks */}
//             <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
//                 <label htmlFor="marks">Marks</label>
//                 <Field name="marks" id="marks" type="number" placeholder="Enter Marks" />
//                 {errors.marks && touched.marks && <div style={{color: "#ff0000"}}>{errors.marks}</div>}
//             </Box>
//         </Box>
//         </Form>
// )}






// in TopicSlice

// syncTopicLanguageName: (state, action) => {
//             const { oldName, newName } = action.payload;
//             state.list = state.list.map((topic) =>
//                 topic.languageName === oldName
//                     ? { ...topic, languageName: newName }
//                     : topic
//             );
//         },

/* -------------------------------------------------------------------------------- */

// in AddLanguage 
// const patchData = (id, values, resetForm) => {
//     const oldName = languages.find((l) => l._id === id)?.languageName; // 👈 get old name

//     axios.patch(`https://generateapi.techsnack.online/api/language/${id}`, values, {
//         headers: { Authorization: token }
//     })
//     .then((res) => {
//         if (res.status === 200 || res.status === 204) {
//             dispatch(updateLanguage({ _id: id, ...values }));

//             if (oldName && oldName !== values.languageName) {
//                 dispatch(syncTopicLanguageName({ oldName, newName: values.languageName })); // 👈
//             }

//             ShowSnackbar("Language Updated Successfully !", "success");
//             resetForm();
//             dispatch(resetFormValues());
//             dispatch(resetUIstate());
//         }
//     })
//     .catch((err) => {
//         console.error("PATCH error: ", err);
//         toast.error("Update Failed !");
//     });
// };






import React, { useEffect } from 'react'
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, 
    InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, 
    useMediaQuery, useTheme 
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addQuestion, deleteQuestion, resetDeleteState, resetFormValues, resetUIstate, setDeleteId, 
    setDeleteOpen, setEditId, setFormValues, setOpenForm, setQuestion, setSearchItem, updateQuestion 
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

const AddQuestions = () => {
    const { list: questions = [], openForm, formValues, searchItem, deleteOpen, deleteId, editId } = useSelector((state) => state.questionStore);
    const { list: subjects = [] } = useSelector((state) => state.subjectStore);
    const { list: topics = [] } = useSelector((state) => state.topicStore);
    const dispatch = useDispatch();
    const { ShowSnackbar } = useSnackbar();

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

    const options = topics.map((t) => ({ value: t.topicName, label: t.topicName }));

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
                            textTransform: "none"
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
                            {({errors, touched, isValid, dirty, resetForm, setFieldValue, value, setValue}) => (
                                <Form className="question-form">
                                    {/* Subject Name & Topic Name & Marks */}
                                    <Box sx={{ display: "flex", flexDirection: {xs: "column", sm: "row"}, 
                                            gap: 3, mb: 3 
                                        }}
                                    >
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                                            <label htmlFor="subjectName">Subject Name</label>
                                            <Field name="subjectName" id="subjectName" as="select"
                                                onChange={(e) => {
                                                    setFieldValue("subjectName", e.target.value);
                                                    setFieldValue("topicName", ""); // Reset topic when Subject changes
                                                }}
                                            >
                                                <option value="" hidden> Select Subject </option>
                                                {(subjects || []).filter((s) => s.status === "Active")
                                                .map((s) => (
                                                    <option key={s._id} value={s.subjectName}> {s.subjectName} </option>
                                                ))}
                                            </Field>
                                            {errors.subjectName && touched.subjectName && (
                                                <div style={{ color: "#ff0000" }}>{errors.subjectName}</div>
                                            )}
                                        </Box>

                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                                            <label htmlFor="topicName">Topic Name</label>
                                            {/* <Field name="topicName" id="topicName" as="select">
                                                <option value="" hidden> Select Topic </option>
                                                {topics.filter((t) => t.subjectName === values.subjectName && t.status === "Active")
                                                .map((t) => (
                                                    <option key={t._id} value={t.topicName}> {t.topicName} </option>
                                                ))}
                                            </Field> */}
                                            <Select options={options}
                                                onChange={(selected) => helpers.setValue(selected.value)}
                                                placeholder="Search topic..."
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

                <Box sx={{display: "flex", flexDirection: {xs: "column", sm: "row"}, justifyContent: "center", 
                        alignItems: {xs: "stretch", sm: "center"}, gap: {xs: 1, sm: 0}, my: 2
                    }}
                >
                    {/* Search Field */}
                    <Box sx={{ position: 'relative', border: 1, borderRadius: 2, width: { xs: "100%", sm: "60%", md: "50%" }, 
                            py: 0.5, my: 2
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
                    <TableContainer component={Paper} elevation={0} 
                        sx={{ WebkitOverflowScrolling: 'touch', '&::-webkit-scrollbar': { height: '8px' },
                            '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: 4,
                                '&:hover': { backgroundColor: '#555' },
                            },
                        }}
                    >
                        <Table sx={{ borderCollapse: "separate", borderSpacing: 0 }}>
                            <TableHead sx={{ background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)", 
                                    "& .MuiTableCell-head": { color: "#ffffff", fontWeight: 600, fontSize: "14px",
                                    borderBottom: "none" }, whiteSpace: "nowrap"
                                }}
                            >
                                <TableRow>
                                    {["#", "Question", "Subject Name", "Topic Name", "Marks", "Actions"]
                                        .map((h) => (
                                            <TableCell key={h} sx={{ color: "#fff", textAlign: "center" }}>
                                                {h}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            </TableHead>

                            <TableBody sx={{ "& .MuiTableCell-root": { fontSize: "16px", whiteSpace: "nowrap",
                                    borderRight: "1px solid rgba(255, 255, 255, 0.1)", py: 1.5                      
                                }
                            }}>
                                {filteredQuestion.length > 0 ? (
                                    filteredQuestion.map((item, index) => (
                                        <TableRow key={item._id ?? index}
                                            sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                                                "&:hover": { backgroundColor: "#e9f5fd" }, transition: "all 0.3s ease"
                                            }}
                                        >
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.question}</TableCell>
                                            <TableCell>{item.subjectName}</TableCell>
                                            <TableCell>{item.topicName}</TableCell>
                                            <TableCell>{item.marks}</TableCell>
                                            <TableCell>
                                                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", gap: 1}}>
                                                    {/* Delete Button */}
                                                    <Tooltip title="Delete" component={Paper}
                                                        slotProps={{
                                                            tooltip: {
                                                                sx:{ fontSize: "12px", px: 2, color:"#ef4444", background: "#ffddddff",
                                                                    letterSpacing: 1, fontWeight: 600
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <IconButton
                                                            sx={{
                                                                background:"#fff", color: "#ef4444", transition: "0.3s ease-in-out",
                                                                "&:hover": { background: "#dc2626", color:"#fff" }
                                                            }}
                                                            onClick={() => handleDelete(item)}
                                                        >
                                                            <RiDeleteBin6Line />
                                                        </IconButton>
                                                    </Tooltip>

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

                                                    {/* Edit Button */}
                                                    <Tooltip title="Edit" component={Paper}
                                                        slotProps={{
                                                            tooltip: {
                                                                sx:{ fontSize: "12px", px: 2, color:"#2563eb", background: "#dee9ffff",
                                                                    letterSpacing: 1, fontWeight: 600
                                                                }
                                                            }
                                                        }}
                                                    >
                                                    <IconButton
                                                            sx={{
                                                                background: "#fff", color:"#2563eb", transition: "0.2s",
                                                                "&:hover": { background: "#2563eb", color:"#fff" }
                                                            }}
                                                            onClick={() => handleEdit(item)}
                                                        >
                                                            <FaEdit />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">No Question Data Found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
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
        </>
    )
}

export default AddQuestions
