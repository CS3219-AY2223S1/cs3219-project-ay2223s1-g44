import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import SignupPage from './components/SignupPage';
import ChooseLevelPage from "./components/ChooseLevelPage";
import {Box} from "@mui/material";

function App() {
    return (
        <div className="App">
            <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Navigate replace to="/signup" />}></Route>
                        <Route path="/signup" element={<SignupPage/>}/>
                        <Route path="/difficulty" element={<ChooseLevelPage/>}/>
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;
