import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import SignupPage from './components/SignupPage';
import {Box} from "@mui/material";
import SelectDifficultyPage from "./components/SelectDifficultyPage";
import WaitingRoomPage from "./components/WaitingRoomPage";
import MatchFailPage from "./components/MatchFailPage";
import RoomPage from "./components/RoomPage";

function App() {
    return (
        <div className="App">
            <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Navigate replace to="/signup" />} />
                        <Route path="/signup" element={<SignupPage/>}/>
                        <Route path="/select-difficulty" element={<SelectDifficultyPage />} />
                        <Route path="/waiting-room" element={<WaitingRoomPage />} />
                        <Route path="/match-fail" element={<MatchFailPage />} />
                        <Route path="/room" element={<RoomPage />} />
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;
