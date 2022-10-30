import React, { useContext, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import axios from 'axios';
import { authContext } from '../../hooks/useAuth';
import { STATUS_CODE_OK } from '../../constants';

function Dashboard() {
  const { user } = useContext(authContext);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (user.username !== '') {
      axios.get(`http://localhost:8001/history/${user.username}`)
        .then((response) => {
          if (response.status === STATUS_CODE_OK) {
            setData(response.data);
          }
        })
        .catch(() => {
          // TODO: error handling
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <div>
      <Box>
        { user.username }
      </Box>
    </div>
  );
}

export default Dashboard;
