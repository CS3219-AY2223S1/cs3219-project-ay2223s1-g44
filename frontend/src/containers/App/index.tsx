import React from 'react';
import {
  BrowserRouter as Router, Navigate, Route, Routes,
} from 'react-router-dom';

import Navbar from '../../components/NavBar';

import AccountSettings from '../AccountSettings';
import Dashboard from '../Dashboard';
import LevelSelect from '../LevelSelect';
import LogIn from '../LogIn';
import SignUp from '../SignUp';
import WaitingRoomPage from '../MatchRoom';

import { authContext, useAuth } from '../../hooks/useAuth';
import ProtectedLayout from '../../layouts/ProtectedLayout';
import PublicLayout from '../../layouts/PublicLayout';

function App() {
  const auth = useAuth();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
    }} // TODO: swap with tailwind
    >
      <authContext.Provider value={auth}>
        <Router>
          <Navbar />
          <div style={{ height: '100%' }}>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Navigate to="/register" replace />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/login" element={<LogIn />} />
              </Route>
              <Route element={<ProtectedLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/level-select" element={<LevelSelect />} />
                <Route path="/account-settings" element={<AccountSettings />} />
                <Route path="/room/:difficulty" element={<WaitingRoomPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </authContext.Provider>
    </div>
  );
}

export default App;
