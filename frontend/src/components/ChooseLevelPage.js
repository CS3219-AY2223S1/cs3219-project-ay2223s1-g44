import { Container, FormControl, Typography, Select, MenuItem, InputLabel } from '@mui/material'

function ChooseLevelPage() {

    const handleChange = () => {
        console.log("pressed")
    }


    return (
        <Container>
            <FormControl fullWidth>
                <Typography>Choose your preferred difficulty level:</Typography>
                <Select
                    labelId="difficulty-level"
                    id="difficulty-select"
                    label="Age"
                    onChange={handleChange}
                >
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                </Select>
            </FormControl>
        </Container>
    )

}

export default ChooseLevelPage;
