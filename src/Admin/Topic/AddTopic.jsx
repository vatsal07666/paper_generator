import React, { useCallback, useContext, useEffect } from "react";
import * as Yup from "yup";
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider,
    InputBase, Paper, Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { IoMdAdd } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import { DataContext } from "../../Context/ContextProvider";
import { addTopic, deleteTopic, resetDeleteState, resetFormValues, resetUIstate, setDeleteId,
    setDeleteOpen, setEditId, setFormValues, setTopic, setOpenForm, setSearchItem, updateTopic,
} from "./TopicSlice";
import axios from "axios";
import { useSnackbar } from "../../Context/SnackbarContext";
import SearchIcon from "@mui/icons-material/Search";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { setSubject } from "../Subject/SubjectSlice";
import Select from "react-select";

const AddSubject = () => {
    const { list: topics = [], formValues, openForm, searchItem, deleteOpen, deleteId,
        editId,
    } = useSelector((state) => state.topicStore);
    const { list: subjects } = useSelector((state) => state.subjectStore);
    const { status } = useContext(DataContext);
    const dispatch = useDispatch();
    const { ShowSnackbar } = useSnackbar();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    /* ---------------- Validation ---------------- */
    const validationSchema = Yup.object({
        topicName: Yup.string().required("Subject Name is Required*"),
        subjectName: Yup.string().required("Subject Code is Required*"),
        status: Yup.string().required("Status is Required*"),
    });

    /* ---------------- Call Api to get Subject Data ---------------- */
    const getsubjectName = useCallback(() => {
        return axios.get("https://generateapi.techsnack.online/api/subject", {
            headers: { Authorization: "2xzYLLbk3VRezP5s" },
        })
        .then((res) => dispatch(setSubject(res.data.Data)))
        .catch((err) => console.error("GET error: ", err));
    }, [dispatch]);

    useEffect(() => {
        getsubjectName();
    }, [getsubjectName]);

    const token = "7TDdOTQs88FIYRPd";

    /* ---------------- Get Topic ---------------- */
    const getData = () => {
        axios.get("https://generateapi.techsnack.online/api/topic", {
            headers: { Authorization: token },
        })
        .then((res) => {
            console.log("GET response: ", res.data);
            dispatch(setTopic(res.data.Data));
        })
        .catch((err) => console.error("GET error: ", err));
    };

    /* ---------------- Load Data ---------------- */
    useEffect(() => {
        getData();
        // eslint-disable-next-line
    }, []);

    /* ---------------- Post/Save Topic ---------------- */
    const postData = (values, resetForm) => {
        const topicData = { topicName: values.topicName, subjectName: values.subjectName,
            status: values.status,
        };

        axios.post("https://generateapi.techsnack.online/api/topic", topicData, {
            headers: { Authorization: token, "Content-Type": "application/json" },
        })
        .then((res) => {
            console.log("POST response: ", res.data);
            if (res.status === 200 || res.status === 204) {
                dispatch(addTopic(res.data.Data));
                ShowSnackbar("Topic Added Successfully !", "success");
                resetForm();
                dispatch(resetFormValues());
                dispatch(resetUIstate());
            }
        })
        .catch((err) => console.error("POST error: ", err));
    };

    /* ---------------- Delete Topic ---------------- */
    const deleteData = () => {
        axios.delete(`https://generateapi.techsnack.online/api/topic/${deleteId}`, {
            headers: { Authorization: token },
        })
        .then((res) => {
            console.log("DELETE response: ", res.status);
            if (res.status === 200 || res.status === 204) {
                dispatch(deleteTopic(deleteId));
                dispatch(resetDeleteState());
                ShowSnackbar("Topic Deleted Successfully !", "error");
            }
        })
        .catch((err) => {
            console.log("DELETE error: ", err);
        });
    };

    /* ---------------- Patch/Update/Edit Topic ---------------- */
    const patchData = (id, values, resetForm) => {
        axios.patch(`https://generateapi.techsnack.online/api/topic/${id}`, values, {
            headers: { Authorization: token },
        })
        .then((res) => {
            console.log("PATCH response: ", res.data);
            if (res.status === 200 || res.status === 204) {
                dispatch(updateTopic({ _id: id, ...values }));
                ShowSnackbar("Topic Updated Successfully !", "success");
                resetForm();
                dispatch(resetFormValues());
                dispatch(resetUIstate());
            }
        })
        .catch((err) => {
            console.error("PATCH response: ", err);
        });
    };

    /* ---------------- Submission Logic ---------------- */
    const handleSubmit = (values, { resetForm }) => {
        if (editId !== null) {
            patchData(editId, values, resetForm);
        } else {
            postData(values, resetForm);
        }
    };

    /* ---------------- Cancle Logic ---------------- */
    const handleCancel = (resetForm) => {
        resetForm();
        dispatch(resetUIstate());
        dispatch(resetFormValues());
    };

    /* ---------------- Delete Logic ---------------- */
    const handleDelete = (item) => {
        dispatch(setDeleteOpen(true));
        dispatch(setDeleteId(item._id));
    };

    /* ---------------- Edit Logic ---------------- */
    const handleEdit = (item) => {
        dispatch(setOpenForm(true));
        dispatch(setEditId(item._id));
        dispatch(setFormValues({ topicName: item.topicName, subjectName: item.subjectName,
                status: item.status,
            }),
        );
    };

    /* ---------------- Search/Filter Logic ---------------- */
    const filteredTopic = topics.filter((l) =>
        [l.topicName, l.subjectName, l.status].join(" ").toLowerCase().includes(searchItem.toLowerCase()),
    );

    const subjectOptions = subjects.map((s) => ({ value: s.subjectName, label: s.subjectName }));
    const statusOptions = status.map((st) => ({ label: st, value: st }));

    return (
        <>
            <Box sx={{ m: isMobile ? 0 : 2 }}>
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {/* Heading */}
                    <Box>
                        <Typography component={"h1"} variant={isMobile ? "h6" : "h5"} fontWeight={600}>
                            Topics ({topics.length})
                        </Typography>
                        <Typography variant="span" sx={{ color: "#888888", fontSize: isMobile ? 14 : 16 }}>
                            List of all Topics
                        </Typography>
                    </Box>

                    {/* Add Topic Button */}
                    <Button onClick={() => dispatch(setOpenForm(true))}
                        sx={{ background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)", color: "#fff", 
                            p: "8px 14px", borderRadius: 2, whiteSpace: "none", textTransform: "none", 
                            "&:hover": { filter: "brightness(1.3)" }
                        }}
                        startIcon={<IoMdAdd />}
                    >
                        {isMobile ? "Add" : "Add Topic"}
                    </Button>
                </Box>

                {/* Topic Form */}
                <Dialog open={openForm} sx={{ zIndex: 2000 }} maxWidth="md" fullWidth disableRestoreFocus
                    slotProps={{
                        backdrop: {
                            sx: { backgroundColor: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" },
                        },
                    }}
                >
                    {/* Form Title */}
                    <DialogTitle sx={{ fontWeight: 700 }}>
                        {editId !== null ? "Edit Topic" : "Add New Topic"}
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
                            {({ errors, touched, isValid, dirty, resetForm, values, setFieldValue }) => (
                                <Form className="topic-form">
                                    {/* Topic Name */}
                                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" },
                                            gap: 3, mb: 3,
                                        }}
                                    >
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                                            <label htmlFor="topicName">Topic Name</label>
                                            <Field name="topicName" id="topicName" placeholder="Enter Topic Name"/>
                                            {errors.topicName && touched.topicName && (
                                                <div style={{ color: "#ff0000" }}> {errors.topicName} </div>
                                            )}
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" },
                                            gap: 3, mb: 3,
                                        }}
                                    >
                                        {/* Subject Name Field */}
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

                                        {/* Status Field */}
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                                            <label htmlFor="status">Status</label>
                                            <Select options={statusOptions} placeholder="Select Status"
                                                value={statusOptions.find(
                                                    (option) => option.value === values.status
                                                ) || null}
                                                onChange={(option) => setFieldValue("status", option ? option.value : "")}
                                                isSearchable
                                                isClearable
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                    placeholder: (base) => ({ ...base, fontSize: 14, }),
                                                }}
                                            />
                                            {errors.status && touched.status && (
                                                <div style={{ color: "#ff0000" }}>{errors.status}</div>
                                            )}
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

                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "center",
                        alignItems: { xs: "stretch", sm: "center" }, gap: { xs: 1, sm: 0 }, my: 2,
                    }}
                >
                    {/* Search Field */}
                    <Box sx={{ position: "relative", borderRadius: 2, border: "1px solid #ddd",
                            width: { xs: "100%", sm: "60%", md: "50%" }, py: 0.5, my: 2, background: "#fff",
                            boxShadow: "0 6px 16px rgba(0,0,0,0.1)"
                        }}
                    >
                        <InputBase name="search" placeholder="Search Topics" value={searchItem ?? ""}
                            onChange={(e) => dispatch(setSearchItem(e.target.value))}
                            sx={{ paddingLeft: "40px", width: "100%", boxSizing: "border-box" }}
                        />
                        <SearchIcon sx={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
                    </Box>
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                    {filteredTopic.length > 0 ? (
                        filteredTopic.map((item, index) => (
                            <Card key={item._id ?? index}
                                sx={{ borderRadius: 3, boxShadow: 2, display: "flex", flexDirection: "column" }}
                            >
                                {/* Content */}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                                        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.6 }}>
                                            <Typography variant="body2" fontSize={"16px"}>
                                                <b>Topic Name:</b> {item.topicName}
                                            </Typography>
                                            <Typography variant="body2" fontSize={"14.5px"} color="text.secondary">
                                                <b>Subject Name:</b> {item.subjectName}
                                            </Typography>
                                        </Box>

                                        <Typography variant="body2" sx={{ textAlign: "right" }}>
                                            <span style={{ background: item.status === "Active" ? "#4caf50" : "#f44336",
                                                    padding: "4px 10px", borderRadius: "20px", fontSize: "13px",
                                                    color: "#fff",
                                                }}
                                            >
                                                {item.status}
                                            </span>
                                        </Typography>
                                    </Box>
                                </CardContent>

                                {/* Actions */}
                                <Box sx={{ display: "flex", justifyContent: "center", gap: 1, pb: 2,
                                    }}
                                >
                                    {/* Delete */}
                                    <Button sx={{ background: "#fff", color: "#ef4444", border: 1,
                                            whiteSpace: "nowrap", textTransform: "none"
                                        }}
                                        onClick={() => handleDelete(item)}
                                    >
                                        <RiDeleteBin6Line />&nbsp; Delete
                                    </Button>

                                    {/* Edit */}
                                    <Button sx={{ background: "#fff", color: "#2563eb", border: 1,
                                            whiteSpace: "nowrap", textTransform: "none"
                                        }}
                                        onClick={() => handleEdit(item)}
                                    >
                                        <FaEdit />&nbsp; Edit
                                    </Button>
                                </Box>
                            </Card>
                        ))
                    ) : (   
                        <Paper sx={{ p: 3, textAlign: "center", gridColumn: "1 / -1" }}> Topics Data Not Found ! </Paper>
                    )}
                </Box>
            </Box>

            {/* Delete Button Dialog */}
            <Dialog open={deleteOpen} fullWidth onClose={() => dispatch(resetDeleteState())}
                disableRestoreFocus
                slotProps={{
                    backdrop: {
                        sx: { backgroundColor: "rgba(0,0,0,0.35)",
                            backdropFilter: "blur(4px)",
                        },
                    },
                }}
            >
                <DialogTitle id="alert-dialog-title"> Confirm Delete By Clicking Delete! </DialogTitle>

                <DialogActions>
                    <Button onClick={() => dispatch(resetDeleteState())}
                        variant="contained"
                        sx={{ color: "#1e293b", background: "#fff",
                            "&:hover": { boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.5)" },
                        }}
                    >
                        Cancle
                    </Button>

                    <Button variant="contained" className="agree-button"
                        onClick={deleteData}
                        sx={{ background: "#ef4444", color: "#fff", transition: "0.2s ease-in-out",
                            "&:hover": { background: "#fff", color: "#ff0000",
                                boxShadow: "0 0 2px rgba(255, 0, 0, 1)",
                            },
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddSubject;
