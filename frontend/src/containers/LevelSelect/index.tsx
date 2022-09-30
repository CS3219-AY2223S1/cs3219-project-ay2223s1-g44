import React, { useState } from 'react';
import {
  Box, Button, Select,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

function LevelSelect() {
  const [difficulty, setDifficulty] = useState('easy');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value);
  };

  return (
    <Box display="flex" flexDirection="column" width="100%" alignItems="center">
      <Select placeholder="Select option" onChange={handleChange}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </Select>
      <Button as={RouterLink} to={`/room/${difficulty}`}>Find Match</Button>
    </Box>
  );
}

export default LevelSelect;
