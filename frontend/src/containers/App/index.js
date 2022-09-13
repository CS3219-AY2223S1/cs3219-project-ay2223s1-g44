import React, {
  BrowserRouter as Router, Navigate, Route, Routes,
} from 'react-router-dom';

import Navbar from '../../components/Navbar';

import AccountSettings from '../AccountSettings';
import Dashboard from '../Dashboard';
import LevelSelect from '../LevelSelect';
import LogIn from '../LogIn';
import SignUp from '../SignUp';
import WaitingRoomPage from '../MatchRoom'

import { authContext, useAuth } from '../../hooks/useAuth';
import ProtectedLayout from '../../layouts/ProtectedLayout';
import PublicLayout from '../../layouts/PublicLayout';

import styles from './App.module.scss';

function App() {
  const auth = useAuth();

  return (
    <div className={styles.screen}>
      <authContext.Provider value={auth}>
        <Router>
          <Navbar />
          <div className={styles.main}>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route exact path="/" element={<Navigate to="/register" replace />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/login" element={<LogIn />} />
              </Route>
              <Route element={<ProtectedLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/level-select" element={<LevelSelect />} />
                <Route path="/account-settings" element={<AccountSettings />} />
                <Route path="/room/:diff" element={<WaitingRoomPage />} />
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
