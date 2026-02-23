import React, { useContext, useEffect } from 'react'
import * as Yup from "yup";
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { IoMdAdd } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import { DataContext } from '../../Context/ContextProvider';
import { addLanguage, deleteLanguage, resetDeleteState, resetFormValues, resetUIstate, setDeleteId, setDeleteOpen, setEditId, setFormValues, setLanguage, setOpenForm, setSearchItem, updateLanguage } from './LanguageSlice';
import axios from 'axios';
import { useSnackbar } from '../../Context/SnackbarContext';
import SearchIcon from '@mui/icons-material/Search';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AddLanguage = () => {
    const { list: languages = [], formValues, openForm, searchItem, deleteOpen, deleteId, editId } = useSelector((state) => state.languageStore);
    const { status } = useContext(DataContext);
    const dispatch = useDispatch();
    const { ShowSnackbar } = useSnackbar();
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const validationSchema = Yup.object({
        languageName: Yup.string().required("Language Name is Required*"),
        languageCode: Yup.string().required("Language Code is Required*"),
        status: Yup.string().required("Status is Required*")
    })

    const token = "4MWMvdHWdPr8NGwM";

    const getData = () => {
        axios.get("https://generateapi.techsnack.online/api/language", {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("GET response: ", res.data);
            dispatch(setLanguage(res.data.Data));
        })
        .catch((err) => console.error("GET error: ", err));
    }

    useEffect(() => { 
        getData() 
        // eslint-disable-next-line 
    }, [])

    const postData = (values, resetForm) => {
        const data = { languageName: values.languageName, languageCode: values.languageCode, status: values.status };

        axios.post("https://generateapi.techsnack.online/api/language", data, {
            headers: { Authorization: token, "Content-Type": "application/json" }
        })
        .then((res) => {
            console.log("POST response: ", res.data);
            if(res.status === 200 || res.status === 204){
                dispatch(addLanguage(res.data.Data));
                ShowSnackbar("Language Added Successfully !", "success");
                resetForm();
                dispatch(resetFormValues());
                dispatch(resetUIstate());
            }
        })
        .catch((err) => console.error("POST error: ", err));
    }

    const deleteData = () => {
        axios.delete(`https://generateapi.techsnack.online/api/language/${deleteId}`, {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("DELETE response: ", res.status);
            if(res.status === 200 || res.status === 204){
                dispatch(deleteLanguage(deleteId));
                dispatch(resetDeleteState());
                ShowSnackbar("Language Deleted Successfully !", "error");
            }
        })
        .catch((err) => {
            console.log("DELETE error: ", err);
        })
    }

    const patchData = (id, values, resetForm) => {
        axios.patch(`https://generateapi.techsnack.online/api/language/${id}`, values, {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("PATCH response: ", res.data);
            if(res.status === 200 || res.status === 204){
                dispatch(updateLanguage({_id: id, ...values}));
                ShowSnackbar("Language Updated Successfully !", "success");
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
            languageName: item.languageName, languageCode: item.languageCode, status: item.status, 
        }));
    }

    /* ---------------- Search ---------------- */
    const filteredLanguage = languages.filter(l =>
        [l.languageName, l.languageCode, l.status].join(" ").toLowerCase().includes(searchItem.toLowerCase())
    )

    return (
        <>
            <Box>
                {/* Heading & Add Language Button */}
                <Box sx={{display: "flex", flexDirection: {xs: "column", sm: "row"}, justifyContent: "space-between", 
                        alignItems: {xs: "flex-start", sm: "center"}
                    }}
                >
                    <Box>
                        <h1>Languages ({languages.length})</h1>
                        <Typography variant='span' sx={{color: "#888888", fontSize: "15px"}}>
                            List of all languages
                        </Typography>
                    </Box>
                    
                    <Button  onClick={() => dispatch(setOpenForm(true))}
                        sx={{background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)", color: "#fff", 
                            p: "8px 14px", borderRadius: 2, mt: {xs: 2, sm: 0}, whiteSpace: "none", 
                            textTransform: "none"
                        }}
                        startIcon={<IoMdAdd />}
                    >
                        Add Language
                    </Button>
                </Box>

                {/* Product Form */}
                <Dialog open={openForm} sx={{ zIndex: 2000 }} maxWidth="md" fullWidth disableRestoreFocus
                    slotProps={{
                        backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" } }
                    }}
                >
                    <DialogTitle sx={{ fontWeight: 700 }}>
                        {editId !== null ? "Edit Language" : "Add New Language"}
                    </DialogTitle>

                    <Divider />
                
                    <DialogContent sx={{ mt: 1 }}>
                        <Formik initialValues={formValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {({errors, touched, isValid, dirty, resetForm}) => (
                                <Form className="language-form">
                                    {/* Language Name & Code */}
                                    <Box sx={{ display: "flex", flexDirection: {xs: "column", sm: "row"}, 
                                            gap: 3, mb: 3 
                                        }}
                                    >
                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label htmlFor="languageName">Language Name</label>
                                            <Field name="languageName" id="languageName" placeholder="Enter Language Name" />
                                            {errors.languageName && touched.languageName && <div style={{color: "#ff0000"}}>{errors.languageName}</div>}
                                        </Box>

                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label htmlFor="languageCode">Language Code</label>
                                            <Field name="languageCode" id="languageCode" placeholder="Enter Language Code" />
                                            {errors.languageCode && touched.languageCode && <div style={{color: "#ff0000"}}>{errors.languageCode}</div>}
                                        </Box>
                                    </Box>

                                    {/* Status */}
                                    <Box sx={{ display: "flex", flexDirection: {xs: "column", sm: "row"}, 
                                            gap: 3, mb: 3 
                                        }}
                                    >
                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label htmlFor="status">Status</label>
                                            <Field name="status" id="status" as="select"> 
                                                <option value="" hidden>Select Status</option>
                                                {status.map((st) => <option key={st} value={st}>{st}</option>)}
                                            </Field>
                                            {errors.status && touched.status && <div style={{color: "#ff0000"}}>{errors.status}</div>}
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
                        <InputBase name="search" placeholder="Search Product" value={searchItem ?? ""}
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
                                    {["#", "Language Name", "Language Code", "Status", "Actions"]
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
                                {filteredLanguage.length > 0 ? (
                                    filteredLanguage.map((item, index) => (
                                        <TableRow key={item._id ?? index}
                                            sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                                                "&:hover": { backgroundColor: "#e9f5fd" }, transition: "all 0.3s ease"
                                            }}
                                        >
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.languageName}</TableCell>
                                            <TableCell>{item.languageCode}</TableCell>
                                            <TableCell style={{textAlign: "center"}}>
                                                <span style={{ background: item.status === "Active" ? "#4caf50" : "#f44336",
                                                        padding: "4px 10px", borderRadius: "20px", fontSize: "13px", 
                                                        color: "#fff"
                                                    }}
                                                >
                                                    {item.status}
                                                </span>
                                            </TableCell>
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
                                        <TableCell colSpan={5} align="center">No Language Data Found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2}}>
                        {filteredLanguage.map((item, index) => (
                            <Card key={item._id ?? index}
                                sx={{ borderRadius: 3, boxShadow: 2, display: "flex", flexDirection: "column" }}
                            >
                                {/* CONTENT */}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2"><b>Language Name:</b> {item.languageName}</Typography>
                                    <Typography variant="body2"><b>Language Code:</b> {item.languageCode}</Typography>
                                    <Typography variant="body2" sx={{mt: 1}}>
                                        <b>Status:&nbsp;</b> 
                                        <span style={{ background: item.status === "Active" ? "#4caf50" : "#f44336",
                                                padding: "4px 10px", borderRadius: "20px", fontSize: "13px", color: "#fff"
                                            }}
                                        >
                                            {item.status}
                                        </span>
                                    </Typography>
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

export default AddLanguage;