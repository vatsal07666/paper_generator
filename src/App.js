import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Index from "./Admin/Index/Index";
import Dashboard from "./Admin/Dashboard/Dashboard";
import HomePage from "./User/HomePage/HomePage";
import PrivateRoute from "./Route/PrivateRoute";
import Layout from "./User/Layout/Layout";
import LoginPage from "./Login-&-Register/LoginPage";
import RegisterPage from "./Login-&-Register/RegisterPage";
import AddLanguage from "./Admin/Language/AddLanguage";
import AddTopic from "./Admin/Topic/AddTopic";
import AddQuestions from "./Admin/Questions/AddQuestions";

function App() {
    return (
        <>
            <Router>
                <Switch>
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/register" component={RegisterPage} />

                    {/* Admin Routes */}
                    <Route path="/admin">
                        <Index>
                            <Switch>
                                <PrivateRoute exact path="/admin" component={Dashboard} role="admin" />
                                <PrivateRoute exact path="/admin/language" component={AddLanguage} role="admin" />
                                <PrivateRoute exact path="/admin/topic" component={AddTopic} role="admin" />
                                <PrivateRoute exact path="/admin/question" component={AddQuestions} role="admin" />
                            </Switch>
                        </Index>
                    </Route>

                    {/* User Routes */}
                    <Route path="/">
                        <Layout>
                            <Switch>
                                <PrivateRoute exact path="/" component={HomePage} role="user" />
                            </Switch>
                        </Layout>
                    </Route>
                </Switch>
            </Router>
        </>
    );
}

export default App;
