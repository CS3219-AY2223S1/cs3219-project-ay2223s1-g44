import {
    Box,
    Typography
} from '@mui/material';

function DashboardPage() {
    return (
        <div>
            <Box display={'flex'} flexDirection={'column'} width={'100%'} alignItems="center" >
                <Typography>I am the dashboard</Typography>
            </Box>
        </div>
    );
}

export default DashboardPage;
