import { Box, TextField, Button, Alert } from "@mui/material";
import { useState } from "react";
import axios from "axios";

const ChangePassword = () => {
    const [error, setError] = useState({
        status: false,
        msg: "",
        type: ""
    });
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const data = new FormData(event.currentTarget);
        const actualData = {
            password: data.get('password'),
            password_confirmation: data.get('password_confirmation'),
        }
    
        if (!actualData.password || !actualData.password_confirmation) {
            setError({ status: true, msg: "All Fields are Required", type: 'error' });
            return;
        }
    
        if (actualData.password !== actualData.password_confirmation) {
            setError({ status: true, msg: "Password and Confirm Password Doesn't Match", type: 'error' });
            return;
        }
    
        const token = localStorage.getItem('token');
    
        try {
            const response = await axios.post(`http://localhost:5000/api/user/changepassword`, {
                password: actualData.password,
                password_confirmation: actualData.password_confirmation,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            document.getElementById('password-change-form').reset();
            setError({ status: true, msg: "Password changed Successfully", type: 'success' });
        } catch (error) {
            setError({ status: true, msg: error.response.data.message, type: 'error' });
        }
    };
    

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', maxWidth: 600, mx: 4 }}>
            <h1>Change Password</h1>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} id="password-change-form">
                <TextField margin="normal" required fullWidth name="password" label="New Password" type="password" id="password" />
                <TextField margin="normal" required fullWidth name="password_confirmation" label="Confirm New Password" type="password" id="password_confirmation" />
                <Box textAlign='center'>
                    <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Update</Button>
                </Box>
                {error.status ? <Alert severity={error.type}> {error.msg} </Alert> : ''}
            </Box>
        </Box>
    );
}

export default ChangePassword;
