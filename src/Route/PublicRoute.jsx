import React from "react";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ component: Component, ...rest }) => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");

    return (
        <Route
            {...rest}
            render={(props) =>
                !token ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={role === "admin" ? "/admin" : "/"} />
                )
            }
        />
    );
};

export default PublicRoute;