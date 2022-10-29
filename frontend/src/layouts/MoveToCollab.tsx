import React from 'react';
import { Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export default function MoveToCollab() {
  return (
    <div style={{ marginTop: '100px' }}>
      You have an active matching!
      <Link as={RouterLink} to="collab-space">Go to Collaboration Room</Link>
    </div>
  );
}
