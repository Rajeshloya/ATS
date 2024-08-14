import { Grid, TextField, Button, Box, Alert } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import validator from 'validator'; // Import the validator library

const SendPasswordResetEmail = () => {
    const [error, setError] = useState({
        status: false,
        msg: "",
        type: ""
    })

    const [redirecting, setRedirecting] = useState(false); // Add state for redirection
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const email = data.get('email');

        if (!email || !validator.isEmail(email)) {
            setError({ status: true, msg: "Please provide a valid email address", type: 'error' });
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/api/user/send-reset-password-email",
                { recoveryEmail: email }
            );
            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            setError({ status: true, msg: "Password Reset Email Sent. Check Your Email !!", type: 'success' });
            // Redirect after a delay
            setRedirecting(true);
            setTimeout(() => {
                window.location.href = response.data.link;
            }, 2000); // Redirect after 2 seconds
        } catch (error) {
            console.error(error);
            setError({ status: true, msg: "An error occurred. Please try again later.", type: 'error' });
        }
    }

    return <>
        <Grid container justifyContent={'center'}>
            <Grid item sm={6} xs={12}>
                <Box component='form' noValidate sx={{ mt: 1 }} id='password-reset-email' onSubmit={handleSubmit}>
                    <TextField margin='normal' required fullWidth id='email' name='email' label='Email Address' />
                    <Box textAlign='center'>
                        <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Send </Button>
                    </Box>
                    <Box>
                        {error.status && <Alert severity={error.type}> {error.msg} </Alert>}
                    </Box>
                    {redirecting && <Box mt={2}>Redirecting...</Box>} {'Redirecting to password reset page'}
                </Box>
            </Grid>
        </Grid>
    </>
}

export default SendPasswordResetEmail;
