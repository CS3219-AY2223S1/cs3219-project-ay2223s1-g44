import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { MenuItem, TextField, Box, Button } from '@mui/material'

function SelectDifficultyPage() {

    const [difficulty, setDifficulty] = useState('')
    console.log(difficulty)

    let navigate = useNavigate();
    const handleChange = (event) => {
        setDifficulty(event.target.value)
    }

    const onProceed = () => {
        if (difficulty === '') {
            console.log('error')
        }
        let path = '/waiting-room'
        navigate(path, {difficulty: 'Hard'})
    }

    return (
        <Box width='500px'>
            <TextField label='Select difficulty' select value={difficulty} onChange={handleChange} fullWidth>
                <MenuItem value="EASY">Easy</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HARD">Hard</MenuItem>
            </TextField>
            <Button variant='outlined' onClick={onProceed}>Proceed</Button>
        </Box>
    )

}

export default SelectDifficultyPage;
