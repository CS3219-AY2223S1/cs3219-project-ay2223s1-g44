import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    FormControl,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { URL_USER_SVC } from '../configs';

function ChooseLevelPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [difficulty, setDifficulty] = useState('Easy')

    const handleChange = (event) => {
        setDifficulty(event.target.value);
    };

    const handleLogout = async () => {
        await axios
            .delete(`${URL_USER_SVC}/logout`, { withCredentials: true })
            .then((response) => {}); // TODO: show logout feedback
    };

    const handlePasswordChange = async () => {
        await axios
            .put(`${URL_USER_SVC}/password`, { password }, { withCredentials: true })
            .then((response) => {}); // TODO: show password change feedback
        setIsDialogOpen(false);
    };

    return (
        <Box display={'flex'} flexDirection={'column'} width={'50%'}>
            <FormControl fullWidth>
                <Typography>Choose your preferred difficulty level:</Typography>
                <Select
                    labelId="difficulty-level"
                    id="difficulty-select"
                    label="Age"
                    value={difficulty}
                    onChange={handleChange}
                >
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                </Select>
            </FormControl>
            <Button component={Link} to="/room">GET MATCH</Button>
            {/* TODO: only redirect to login page on successful logout */}
            <Button onClick={handleLogout} component={Link} to="/login">
                Log out
            </Button>
            {/* TODO: proper interface for changing user password */}
            <Button onClick={() => setIsDialogOpen(true)}>Change password</Button>

            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogContent>
                    <DialogContentText>{'Change password'}</DialogContentText>
                    <TextField
                        label="Password"
                        variant="standard"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlePasswordChange}>Submit</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ChooseLevelPage;
