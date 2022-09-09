import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
} from '@mui/material';
import {
    STATUS_CODE_OK,
} from '../constants';
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { URL_USER_SVC } from '../configs';

function AccountSettingsPage() {
    const [password, setPassword] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMsg, setDialogMsg] = useState('');


    const handleLogout = async () => {
        await axios
            .delete(`${URL_USER_SVC}/logout`, { withCredentials: true })
            .then((response) => {
                if (response.status === STATUS_CODE_OK) {
                    setSuccessDialog('Logout!');
                }
            }); // TODO: show logout feedback
    };

    const handlePasswordChange = async () => {
        if (password) {
            await axios
            .put(`${URL_USER_SVC}/password`, { password }, { withCredentials: true })
            .then((response) => {
                if (response.status === STATUS_CODE_OK) {
                    setSuccessDialog('Password Changed!');
                }
            }).catch((err) => {
                setErrorDialog(err);
            })
        } else {
            setErrorDialog("Please enter a valid password!");
        }
    };

    const closeDialog = () => setIsDialogOpen(false);

    const setSuccessDialog = (msg) => {
        setIsDialogOpen(true);
        setDialogTitle('Success');
        setDialogMsg(msg);
    };

    const setErrorDialog = (msg) => {
        setIsDialogOpen(true);
        setDialogTitle('Error');
        setDialogMsg(msg);
    };

    return (
        <Box display={'flex'} flexDirection={'column'} width={'100%'} alignItems={'center'} sx={{ marginTop: '2rem' }}>
            <TextField
                label="Password"
                variant="standard"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: '1rem' }}
            />

            <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} sx={{ marginBottom: '2rem' }}>
                <Button variant={'outlined'}  
                    onClick={() => {
                        handlePasswordChange();
                    }}>
                    Change Password
                </Button>
            </Box>

            <Dialog open={isDialogOpen} onClose={closeDialog}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
            </Dialog>

            {/* TODO: only redirect to login page on successful logout */}
            <Button component={Link} to="/login" onClick={() => {handleLogout();}}>
                Log out
            </Button>
        </Box>
    );
}

export default AccountSettingsPage;
