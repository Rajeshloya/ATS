import React from 'react';
import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { NavLink } from "react-router-dom";

const DashboardNavbar = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="secondary">
                <Toolbar>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                        Clonet Dashboard
                    </Typography>
                    <Button component={NavLink} to='/dashboard' exact activeClassName="active-link" sx={{ color: 'white', textTransform: 'none' }}>
                        Home
                    </Button>
                    <Button component={NavLink} to='/dashboard/fileupload' activeClassName="active-link" sx={{ color: 'white', textTransform: 'none' }}>
                        File Upload
                    </Button>
                    <Button component={NavLink} to='/dashboard/filelist' activeClassName="active-link" sx={{ color: 'white', textTransform: 'none' }}>
                        File List
                    </Button>
                    <Button component={NavLink} to='/dashboard/changepassword' activeClassName="active-link" sx={{ color: 'white', textTransform: 'none' }}>
                        Change Password
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default DashboardNavbar;
