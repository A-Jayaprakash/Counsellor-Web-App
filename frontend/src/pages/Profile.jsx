import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  TextField,
  AppBar,
  Toolbar,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, Edit, Save, Person } from '@mui/icons-material';
import apiClient from '../services/apiClient';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    department: user?.department || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await apiClient.patch('/users/profile', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        department: formData.department,
      });

      setSuccess('Profile updated successfully!');
      setEditMode(false);
      
      // Refresh user data
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    return `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')}>
            Back
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
            My Profile
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Avatar Section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'primary.main',
                fontSize: 40,
                mx: 'auto',
                mb: 2,
              }}
            >
              {getInitials()}
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.role?.toUpperCase()}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Profile Form */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                fullWidth
                disabled
                helperText="Email cannot be changed"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
                placeholder="e.g., Computer Science"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Role"
                value={user?.role?.toUpperCase()}
                fullWidth
                disabled
                helperText="Role cannot be changed"
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            {editMode ? (
              <>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      firstName: user?.firstName || '',
                      lastName: user?.lastName || '',
                      email: user?.email || '',
                      department: user?.department || '',
                    });
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  onClick={handleSave}
                  disabled={loading}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Profile;
