import { Box } from '@mui/material';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import AccountSettingsPage from './components/AccountSettings';
import ChooseLevelPage from './components/ChooseLevelPage';
import DashBoardPage from './components/Dashboard';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProtectedLayout from './layouts/ProtectedLayout';
import Navbar from './components/Navbar/Navbar';

function App() {

    return (
        <div className="App">
            <Box display={'flex'} flexDirection={'column'} padding={'1rem'}>
                <Router>
                    <Navbar/>
                    <Routes>
                        <Route exact path="/" element={<Navigate to="/register" replace />}></Route>
                        <Route path="/register" element={<SignupPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route element={<ProtectedLayout />}>
                            <Route path="/dashboard" element={<DashBoardPage />} />
                            <Route path="/chooselevel" element={<ChooseLevelPage />} />
                            <Route path="/accountsettings" element={<AccountSettingsPage />} />
                        </Route>
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;
