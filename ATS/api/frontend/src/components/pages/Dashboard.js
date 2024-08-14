import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, Grid, Typography, Button } from '@mui/material';
import ChangePassword from './auth/ChangePassword';
import FileUpload from './FileUpload';
import FileList from '../../components/pages/FileList';
import DashboardLayout from '../pages/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("Logout Clicked");
        navigate('/login');
    };

    return (
        <>
            <CssBaseline />
            <Grid container>
                <Grid item sm={2} sx={{ backgroundColor: 'gray', p: 5, color: 'white' }}>
                    <Typography variant='h5'>Email: user.Email</Typography>
                    <Typography variant='h6'>Name: user.Name</Typography>
                    <Button variant='contained' color='warning' size='large'
                        onClick={handleLogout} sx={{ mt: 8 }}>Logout</Button>
                </Grid>
                <Grid item sm={10} sx={{ p: 5 }}>
                    <Routes>
                        <Route path="/" element={<DashboardLayout />}>
                            <Route path="/dashboard/fileupload" element={<FileUpload />} />
                            <Route path="/dashboard/filelist" element={<FileList />} />
                            <Route path="/dashboard/changepassword" element={<ChangePassword />} />
                        </Route>
                    </Routes>
                </Grid>
            </Grid>
        </>
    );
};

export default Dashboard;
