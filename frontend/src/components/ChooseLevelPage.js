import { Button, Container, FormControl, MenuItem, Select, Typography } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { URL_USER_SVC } from '../configs';

function ChooseLevelPage() {
    const handleChange = () => {
        console.log('pressed');
    };

    const handleLogout = async () => {
        await axios
            .delete(`${URL_USER_SVC}/logout`, { withCredentials: true })
            .then((response) => {}); // TODO: show logout feedback
    };

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
            {/* TODO: only redirect to login page on successful logout */}
            <Button onClick={handleLogout} component={Link} to="/login">
                Log out
            </Button>
        </Container>
    );
}

export default ChooseLevelPage;
