import { Box } from '@mui/material';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import ChooseLevelPage from './components/ChooseLevelPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';

function App() {
    return (
        <div className="App">
            <Box display={'flex'} flexDirection={'column'} padding={'4rem'}>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Navigate replace to="/signup" />}></Route>
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/difficulty" element={<ChooseLevelPage />} />
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;
