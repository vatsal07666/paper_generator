import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Index from "./Admin/Index/Index";
import Dashboard from "./Admin/Dashboard/Dashboard";
import LoginPage from "./Login-Register/LoginPage";
import RegisterPage from "./Login-Register/RegisterPage";
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
                    <Route exact path="/" component={LoginPage} />
                    <Route exact path="/register" component={RegisterPage} />

                    <Route path="/admin">
                        <Index>
                            <Switch>
                                <Route exact path="/admin" component={Dashboard} role="admin" />
                                <Route exact path="/admin/subject" component={AddSubject} role="admin" />
                                <Route exact path="/admin/topic" component={AddTopic} role="admin" />
                                <Route exact path="/admin/question" component={AddQuestions} role="admin" />
                                <Route exact path="/admin/view-questions" component={ViewQuestions} role="admin" />
                                <Route exact path="/admin/create-paper" component={CreatePaper} role="admin" />
                            </Switch>
                        </Index>
                    </Route>
                </Switch>
            </Router>
        </>
    );
}

export default App;
