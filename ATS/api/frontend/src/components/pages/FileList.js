import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Paper, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Download as DownloadIcon, Delete as DeleteIcon } from '@mui/icons-material';

const FileList = () => {
  const [fileList, setFileList] = useState([]);
  const [technology, setTechnology] = useState('');
  const [location, setLocation] = useState('');

  const fetchFileList = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/candidates/search', {
        params: { technology, location }
      });
      setFileList(response.data);
    } catch (error) {
      console.error('Error fetching file list:', error);
    }
  }, [technology, location]);

  const handleFileDownload = async (filename) => {
    try {
      const response = await axios.get(`http://localhost:5000/download/${technology}/${filename}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleFileDelete = async (filename) => {
    try {
      await axios.delete(`http://localhost:5000/delete/${filename}`);
      fetchFileList(); // Refresh file list after deletion
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Retrieve Resumes
        </Typography>
        <Box component="form" noValidate sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Technology"
                name="technology"
                variant="outlined"
                value={technology}
                onChange={(e) => setTechnology(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                variant="outlined"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={fetchFileList}
              >
                Find Resumes
              </Button>
            </Grid>
          </Grid>
        </Box>
        {fileList.length > 0 && (
          <List sx={{ mt: 4 }}>
            {fileList.map((filename, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={filename} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="download" onClick={() => handleFileDownload(filename)}>
                    <DownloadIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleFileDelete(filename)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default FileList;
