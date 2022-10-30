import React from 'react';
import { Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export default function MoveToCollab() {
  return (
    <>
      You have an active matching!
      <Link
        p={2}
        as={RouterLink}
        to="collab-space"
        fontSize="sm"
        fontWeight={500}
      >
        Move to Collab Space
      </Link>
    </>
  );
}
