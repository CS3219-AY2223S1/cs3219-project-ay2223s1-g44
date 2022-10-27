import React, { useContext } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { authContext } from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

function Dashboard() {
  const { user } = useContext(authContext);
  const toast = useToast();

  return (
    <div>
      <Box>
        { user.username }
      </Box>
      <Button onClick={() => toast({
        title: 'Log in',
        description: 'Logged in successfully!',
        status: 'success',
      })}
      >
        toast

      </Button>
    </div>
  );
}

export default Dashboard;
