import { Alert, Snackbar } from "@mui/material";
import { createContext, useContext, useState } from "react"

const BarContext = createContext();

export const useSnackbar = () => {
    const context = useContext(BarContext);
    return context;
}

export const SnackbarProvider = ({children}) => {
    const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "success"});

    const ShowSnackbar = (message, severity = "success") => {
        setSnackbar({open: true, message, severity});
    }

    return(
        <BarContext.Provider value={{snackbar, setSnackbar, ShowSnackbar}}>
            {children}

            <Snackbar open={snackbar.open}
                autoHideDuration={2000}
                onClose={() => setSnackbar({...snackbar, open: false})}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            >
                <Alert severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </BarContext.Provider>
    )
}