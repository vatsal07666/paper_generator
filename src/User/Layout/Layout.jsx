import React, { useEffect } from 'react'
import Navbar from '../Navbar/Navbar';
import { useHistory } from 'react-router-dom';

const Layout = ({children}) => {
    const history = useHistory();

    // Optional: redirect if not logged in as user
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const role = localStorage.getItem("role");

        if (!token || role !== "user") {
            history.replace(role === "admin" ? "/admin" : "/login");
        }
    }, [history]);

    return (
        <>
            <Navbar />
            <h1>{children}</h1>
        </>
    )
}

export default Layout