import React from 'react';
import {
  BrowserRouter as Router, Navigate, Route, Routes,
} from 'react-router-dom';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import theme from '../../theme';

import NavBar from '../../components/Navbar';

import AccountSettings from '../AccountSettings';
import CollabSpace from '../CollabSpace';
import Dashboard from '../Dashboard';
import LevelSelect from '../LevelSelect';
import LogIn from '../LogIn';
import SignUp from '../SignUp';
import WaitingRoomPage from '../MatchRoom';

import { authContext, useAuth } from '../../hooks/useAuth';
import ProtectedLayout from '../../layouts/ProtectedLayout';
import PublicLayout from '../../layouts/PublicLayout';
import { matchContext, useMatchDetail } from '../../hooks/useMatch';

function App() {
  const auth = useAuth();
  const matchDetail = useMatchDetail();

  return (
    <authContext.Provider value={auth}>
      <matchContext.Provider value={matchDetail}>
        <ChakraProvider theme={theme}>
          <Flex flexDirection="column" width="100vw" height="100vh">
            <Router>
              <NavBar />
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="/register" element={<SignUp />} />
                  <Route path="/login" element={<LogIn />} />
                </Route>
                <Route element={<ProtectedLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/match-making" element={<LevelSelect />} />
                  <Route path="/account-settings" element={<AccountSettings />} />
                  <Route path="/collab-space" element={<CollabSpace />} />
                  <Route path="/room/:difficulty" element={<WaitingRoomPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </Flex>
        </ChakraProvider>
      </matchContext.Provider>
    </authContext.Provider>
  );
}

export default App;
