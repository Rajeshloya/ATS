import { TextField, FormControlLabel, Checkbox, Button, Box, Alert } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [error, setError] = useState({
        status: false,
        msg: "",
        type: ""
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const actualData = {
            firstname: data.get('firstname'),
            lastname: data.get('lastname'),
            email: data.get('email'),
            recoveryEmail: data.get('recoveryEmail'),
            contact_number: data.get('contact_number'),  // Ensure contact number is included
            password: data.get('password'),
            password_confirmation: data.get('password_confirmation'),
            tc: data.get('tc') === 'agree'
        };

        console.log("Form Data:", actualData);  // Log form data for debugging

        if (
            actualData.firstname &&
            actualData.lastname &&
            actualData.email &&
            actualData.recoveryEmail &&
            actualData.password &&
            actualData.password === actualData.password_confirmation &&
            actualData.tc
        ) {
            // Recovery Email Validation
            const isValidEmail = (email) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            };

            if (!isValidEmail(actualData.recoveryEmail)) {
                setError({
                    status: true,
                    msg: "Recovery Email is not valid",
                    type: "error"
                });
                return;
            }

            try {
                const response = await axios.post(
                    "http://localhost:5000/api/user/register",
                    actualData
                );
                console.log("Response Data:", response.data);  // Log response data for debugging
                localStorage.setItem("token", response.data.token);
                navigate('/dashboard');
            } catch (error) {
                console.error("Error occurred:", error.response.data.message);
                setError({
                    status: true,
                    msg: error.response.data.message,
                    type: "error"
                });
            }
        } else {
            setError({
                status: true,
                msg: "All Fields are Required and Passwords should match",
                type: "error"
            });
        }
    };

    return (
        <>
            <Box component="form" noValidate sx={{ mt: 1 }} id="register-form" onSubmit={handleSubmit}>
                <TextField margin="normal" required fullWidth id="firstname" name="firstname" label="First Name" />
                <TextField margin="normal" required fullWidth id="lastname" name="lastname" label="Last Name" />
                <TextField margin="normal" required fullWidth id="email" name="email" label="Email Address" />
                <TextField margin="normal" required fullWidth id="recoveryEmail" name="recoveryEmail" label="Recovery Email" />
                <TextField margin="normal" required fullWidth id="contact_number" name="contact_number" label="Contact Number" />  
                <TextField margin="normal" required fullWidth id="password" name="password" label="Password" type="password" />
                <TextField margin="normal" required fullWidth id="password_confirmation" name="password_confirmation" label="Confirm Password" type="password" />
                <FormControlLabel control={<Checkbox value="agree" color="primary" name="tc" id="tc" />} label="I agree to terms and conditions." />
                <Box textAlign="center">
                    <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, px: 5 }}>Register</Button>
                </Box>
                <Box textAlign="center">
                    {error.status ? <Alert severity={error.type}>{error.msg}</Alert> : ""}
                </Box>
            </Box>
        </>
    );
};

export default Register;
