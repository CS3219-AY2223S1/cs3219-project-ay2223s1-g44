import React, { useContext } from 'react';
import { Box } from '@chakra-ui/react';
import { authContext } from '../../hooks/useAuth';

function Dashboard() {
  const { user } = useContext(authContext);
  return (
    <div>
      <Box>
        { user.username }
      </Box>
    </div>
  );
}

export default Dashboard;
