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
const patchData = (id, values, resetForm) => {
    const oldName = languages.find((l) => l._id === id)?.languageName; // 👈 get old name

    axios.patch(`https://generateapi.techsnack.online/api/language/${id}`, values, {
        headers: { Authorization: token }
    })
    .then((res) => {
        if (res.status === 200 || res.status === 204) {
            dispatch(updateLanguage({ _id: id, ...values }));

            if (oldName && oldName !== values.languageName) {
                dispatch(syncTopicLanguageName({ oldName, newName: values.languageName })); // 👈
            }

            ShowSnackbar("Language Updated Successfully !", "success");
            resetForm();
            dispatch(resetFormValues());
            dispatch(resetUIstate());
        }
    })
    .catch((err) => {
        console.error("PATCH error: ", err);
        toast.error("Update Failed !");
    });
};