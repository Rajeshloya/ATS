import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNavbar from '../DashboardNavbar'; // Updated import path if needed
import { CssBaseline } from "@mui/material";

const DashboardLayout = () => {
    return (
        <>
            <CssBaseline />
            <DashboardNavbar />
            <Outlet />
        </>
    );
};

export default DashboardLayout;
