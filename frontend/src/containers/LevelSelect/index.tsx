import React, { useState } from 'react';
import {
  Box, FormControl, MenuItem, Select, Typography, Button,
} from '@mui/material';
import { Link } from 'react-router-dom';

function LevelSelect() {
  const [difficulty, setDifficulty] = useState('Easy');

  const handleChange = (e: any) => {
    setDifficulty(e.target.value);
  };

  return (
    <Box display="flex" flexDirection="column" width="100%" alignItems="center">
      <FormControl fullWidth>
        <Typography>Choose your preferred difficulty level:</Typography>
        <Select
          labelId="difficulty-level"
          id="difficulty-select"
          label="Age"
          value={difficulty}
          onChange={(e) => handleChange(e)}
        >
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Hard">Hard</MenuItem>
        </Select>
      </FormControl>
      <Button component={Link} to={`/room/${difficulty}`}>Find Match</Button>
    </Box>
  );
}

export default LevelSelect;
