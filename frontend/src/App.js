import { Box } from '@mui/material';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import ChooseLevelPage from './components/ChooseLevelPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProtectedLayout from './layouts/ProtectedLayout';
import WaitingRoomPage from './components/WaitingRoomPage';

function App() {
    return (
        <div className="App">
            <Box display={'flex'} flexDirection={'column'} padding={'4rem'}>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Navigate to="/signup" replace />}></Route>
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route element={<ProtectedLayout />}>
                            <Route path="/dashboard" element={<ChooseLevelPage />} />
                        </Route>
                        <Route path="/room" element={<WaitingRoomPage />} />
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;
