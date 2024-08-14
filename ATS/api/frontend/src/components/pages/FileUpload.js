import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Select, MenuItem, Button, Box, Typography, Paper, Grid, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const FileUpload = () => {
  const [candidateDetails, setCandidateDetails] = useState({
    firstName: '',
    lastName: '',
    currentLocation: '',
    totalExperience: '',
    technology: '',
    technology_stack: '',
    employmentType: '' // Added employmentType to state
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [usStates, setUsStates] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of US states from the provided endpoint
    const fetchStates = async () => {
      try {
        const response = await axios.get('https://gist.githubusercontent.com/mshafrir/2646763/raw/states_titlecase.json');
        setUsStates(response.data);
      } catch (error) {
        console.error('Error fetching US states:', error);
      }
    };

    fetchStates();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCandidateDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('firstName', candidateDetails.firstName);
    formData.append('lastName', candidateDetails.lastName);
    formData.append('currentLocation', candidateDetails.currentLocation);
    formData.append('totalExperience', candidateDetails.totalExperience);
    formData.append('technology', candidateDetails.technology);
    formData.append('technology_stack', candidateDetails.technology_stack);
    formData.append('employmentType', candidateDetails.employmentType); // Added employmentType to formData

    try {
      await axios.post(`http://localhost:5000/upload/${candidateDetails.technology}`, formData);
      alert('Successfully uploaded resume and details');
      navigate('/joblisting'); // Navigate to the job listing page
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Candidate Registration
        </Typography>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                variant="outlined"
                value={candidateDetails.firstName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                variant="outlined"
                value={candidateDetails.lastName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Current Location</InputLabel>
                <Select
                  name="currentLocation"
                  value={candidateDetails.currentLocation}
                  onChange={handleInputChange}
                  label="Current Location"
                >
                  <MenuItem value="">
                    <em>Select a state</em>
                  </MenuItem>
                  {usStates.map((state) => (
                    <MenuItem key={state.abbreviation} value={state.name}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Total Experience"
                name="totalExperience"
                type="number"
                variant="outlined"
                value={candidateDetails.totalExperience}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Technology</InputLabel>
                <Select
                  name="technology"
                  value={candidateDetails.technology}
                  onChange={handleInputChange}
                  label="Technology"
                >
                  <MenuItem value="">
                    <em>Select Technology</em>
                  </MenuItem>
                  <MenuItem value="Java">Java</MenuItem>
                  <MenuItem value="DevOps">DevOps</MenuItem>
                  <MenuItem value="Python">Python</MenuItem>
                  <MenuItem value="others">Others</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Technology Stack"
                name="technology_stack"
                variant="outlined"
                value={candidateDetails.technology_stack}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <Typography variant="subtitle1">Employment Type</Typography>
                <RadioGroup
                  aria-label="employmentType"
                  name="employmentType"
                  value={candidateDetails.employmentType}
                  onChange={handleInputChange}
                  row
                >
                  <FormControlLabel value="W2" control={<Radio />} label="W2" />
                  <FormControlLabel value="C2C" control={<Radio />} label="C2C" />
                  <FormControlLabel value="C2H" control={<Radio />} label="C2H" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  border: '2px dashed grey',
                  borderRadius: '5px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <Typography>Drag and drop or click to select a file</Typography>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <Typography sx={{ mt: 2 }}>
                    Selected file: {selectedFile.name}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleFileUpload}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default FileUpload;
