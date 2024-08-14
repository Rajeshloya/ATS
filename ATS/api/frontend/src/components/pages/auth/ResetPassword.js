
import { Grid, TextField, Button, Box, Alert } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate()
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: ""
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const actualData = {
      password: data.get('password'),
      password_confirmation: data.get('password_confirmation'),
    }

    if (actualData.password && actualData.password_confirmation) {
      if (actualData.password === actualData.password_confirmation) {
        try {
          const response = await axios.post(`http://localhost:5000/api/user/reset-password/${id}/${token}`, {
            password: actualData.password,
            password_confirmation: actualData.password_confirmation,
          });
          console.log(response.data);
          document.getElementById('password-reset-form').reset();
          setError({ status: true, msg: "Password Reset Successfully. Redirecting to Login Page...", type: 'success' });
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } catch (error) {
          setError({ status: true, msg: error.response.data.message, type: 'error' });
        }
      } else {
        setError({ status: true, msg: "Password and Confirm Password Doesn't Match", type: 'error' });
      }
    } else {
      setError({ status: true, msg: "All Fields are Required", type: 'error' });
    }
  };

  return (
    <Grid container justifyContent={'center'}>
      <Grid item sm={6} xs={12}>
        <Box component='form' noValidate sx={{ mt: 1 }} id='password-reset-form'>
          <TextField margin='normal' required fullWidth id='password' name='password' label='New Password' type='password' />
          <TextField margin='normal' required fullWidth id='password_confirmation' name='password_confirmation' label='Confirm New Password' type='password' />
          <Box textAlign='center'>
            <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Save</Button>
          </Box>
          <Alert severity="info">Debugging Reset Password Component</Alert>
        </Box>
      </Grid>
    </Grid>
  );
};


export default ResetPassword;
