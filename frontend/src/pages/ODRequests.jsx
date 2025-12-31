import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Fab,
  Paper,
  Chip,
} from '@mui/material';
import { ArrowBack, Add, FilterList } from '@mui/icons-material';
import odRequestAPI from '../services/odRequestAPI';
import ODRequestCard from '../components/ODRequest/ODRequestCard';
import ODRequestForm from '../components/ODRequest/ODRequestForm';
import ODDetailsDialog from '../components/ODRequest/ODDetailsDialog';

const ODRequests = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [odRequests, setODRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [currentTab, setCurrentTab] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOD, setSelectedOD] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchODRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [currentTab, odRequests]);

  const fetchODRequests = async () => {
    try {
      setLoading(true);
      const data = await odRequestAPI.getODRequests();
      setODRequests(data.odRequests);
      setError(null);
    } catch (err) {
      console.error('Fetch OD Requests Error:', err);
      setError(err.response?.data?.message || 'Failed to load OD requests');
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    if (currentTab === 'all') {
      setFilteredRequests(odRequests);
    } else {
      setFilteredRequests(odRequests.filter((od) => od.status === currentTab));
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleCreateClick = () => {
    setEditMode(false);
    setSelectedOD(null);
    setFormOpen(true);
  };

  const handleEditClick = (odRequest) => {
    setEditMode(true);
    setSelectedOD(odRequest);
    setFormOpen(true);
  };

  const handleViewClick = (odRequest) => {
    setSelectedOD(odRequest);
    setDetailsOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      if (editMode && selectedOD) {
        await odRequestAPI.updateODRequest(selectedOD._id, formData);
        setSuccess('OD request updated successfully');
      } else {
        await odRequestAPI.createODRequest(formData);
        setSuccess('OD request created successfully');
      }
      setFormOpen(false);
      fetchODRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this OD request?')) {
      return;
    }

    try {
      await odRequestAPI.deleteODRequest(id);
      setSuccess('OD request deleted successfully');
      fetchODRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const getStatusCount = (status) => {
    return odRequests.filter((od) => od.status === status).length;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')}>
            Back
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
            On-Duty Requests
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Paper sx={{ mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange} variant="fullWidth">
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  All
                  <Chip label={odRequests.length} size="small" />
                </Box>
              }
              value="all"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Pending
                  <Chip label={getStatusCount('pending')} size="small" color="warning" />
                </Box>
              }
              value="pending"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Approved
                  <Chip label={getStatusCount('approved')} size="small" color="success" />
                </Box>
              }
              value="approved"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Rejected
                  <Chip label={getStatusCount('rejected')} size="small" color="error" />
                </Box>
              }
              value="rejected"
            />
          </Tabs>
        </Paper>

        {filteredRequests.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No OD requests found
            </Typography>
            {user?.role === 'student' && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Click the + button to create your first OD request
              </Typography>
            )}
          </Paper>
        ) : (
          <Box>
            {filteredRequests.map((odRequest) => (
              <ODRequestCard
                key={odRequest._id}
                odRequest={odRequest}
                onView={handleViewClick}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                userRole={user?.role}
              />
            ))}
          </Box>
        )}
      </Container>

      {user?.role === 'student' && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleCreateClick}
        >
          <Add />
        </Fab>
      )}

      <ODRequestForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editMode ? selectedOD : null}
        loading={formLoading}
      />

      <ODDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        odRequest={selectedOD}
      />
    </>
  );
};

export default ODRequests;
