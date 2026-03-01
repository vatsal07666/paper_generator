import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Index from "./Admin/Index/Index";
import Dashboard from "./Admin/Dashboard/Dashboard";
import HomePage from "./User/HomePage/HomePage";
import PrivateRoute from "./Route/PrivateRoute";
import Layout from "./User/Layout/Layout";
import LoginPage from "./Login-&-Register/LoginPage";
import RegisterPage from "./Login-&-Register/RegisterPage";
import AddSubject from "./Admin/Subject/AddSubject";
import AddTopic from "./Admin/Topic/AddTopic";
import AddQuestions from "./Admin/Questions/AddQuestions";
import ViewQuestions from "./Admin/Questions/ViewQuestions";
import CreatePaper from "./Admin/Paper/CreatePaper";

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
                                <PrivateRoute exact path="/admin/subject" component={AddSubject} role="admin" />
                                <PrivateRoute exact path="/admin/topic" component={AddTopic} role="admin" />
                                <PrivateRoute exact path="/admin/question" component={AddQuestions} role="admin" />
                                <PrivateRoute exact path="/admin/viewQuestions" component={ViewQuestions} role="admin" />
                                <PrivateRoute exact path="/admin/create-paper" component={CreatePaper} role="admin" />
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
