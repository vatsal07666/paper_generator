import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, role, ...rest }) => {
    const userRole = localStorage.getItem("role");
    const token = localStorage.getItem("authToken");

    return (
        <Route
            {...rest} // path, exact etc.
            render={(props) => {
                // Not logged in → redirect to login
                if (!token || !userRole) {
                    return <Redirect to="/log-in" />;
                }

                // Role required → check role
                if (role && userRole !== role) {
                    return <Redirect to={userRole === "admin" ? "/admin" : "/"} />;
                }

                // All checks passed → render component
                return <Component {...props} />;
            }}
        />
    );
};

export default PrivateRoute;
