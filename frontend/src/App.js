import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {Box} from "@mui/material";
import ChooseLevelPage from "./components/ChooseLevelPage";
import LoginPage from "./components/LoginPage";
import SignupPage from './components/SignupPage';
import { setAuthToken } from "./util/setAuthToken";

//check jwt token
const token = localStorage.getItem("token");
if (token) {
    setAuthToken(token);
}

function App() {
    return (
        <div className="App">
            <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Navigate replace to="/signup" />}></Route>
                        <Route path="/signup" element={<SignupPage/>}/>
                        <Route path="/difficulty" element={<ChooseLevelPage />} />
                        <Route path="/login" element={<LoginPage />} />
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;
