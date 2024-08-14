import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/contact', formData);
      console.log('Contact form submitted:', response.data);
      setFormData({ name: '', email: '', message: '' }); // Clear form fields
      setFormError('');
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setFormError('Failed to send message. Please try again later.');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Contact Us
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Your Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Your Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            margin="normal"
            label="Your Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          {formError && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {formError}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            sx={{ mt: 2, mb: 2, px: 4 }}
          >
            Send Message
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ContactPage;
