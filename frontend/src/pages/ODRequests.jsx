import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
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
  Fab,
  Paper,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import { ArrowBack, Add, Search } from '@mui/icons-material';
import odRequestAPI from '../services/odRequestAPI';
import ODRequestCard from '../components/ODRequest/ODRequestCard';
import ODRequestForm from '../components/ODRequest/ODRequestForm';
import ODDetailsDialog from '../components/ODRequest/ODDetailsDialog';
import ApprovalDialog from '../components/ODRequest/ApprovalDialog';
import ConfirmDialog from '../components/Dialogs/ConfirmDialog';

const ODRequests = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();

  const [odRequests, setODRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [currentTab, setCurrentTab] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOD, setSelectedOD] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);

  useEffect(() => {
    fetchODRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [currentTab, odRequests, searchQuery]);

  const fetchODRequests = async () => {
    try {
      setLoading(true);
      const data = await odRequestAPI.getODRequests();
      setODRequests(data.odRequests);
    } catch (err) {
      console.error('Fetch OD Requests Error:', err);
      enqueueSnackbar(err.response?.data?.message || 'Failed to load OD requests', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = odRequests;

    // Filter by status
    if (currentTab !== 'all') {
      filtered = filtered.filter((od) => od.status === currentTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((od) =>
        od.reason.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
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

  const handleApprovalClick = (odRequest) => {
    setSelectedOD(odRequest);
    setApprovalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      if (editMode && selectedOD) {
        await odRequestAPI.updateODRequest(selectedOD._id, formData);
        enqueueSnackbar('OD request updated successfully', { variant: 'success' });
      } else {
        await odRequestAPI.createODRequest(formData);
        enqueueSnackbar('OD request created successfully', { variant: 'success' });
      }
      setFormOpen(false);
      fetchODRequests();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Operation failed', { variant: 'error' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleApprove = async (id, remarks) => {
    try {
      setApprovalLoading(true);
      await odRequestAPI.approveODRequest(id, remarks);
      enqueueSnackbar('OD request approved successfully', { variant: 'success' });
      setApprovalOpen(false);
      fetchODRequests();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Approval failed', { variant: 'error' });
    } finally {
      setApprovalLoading(false);
    }
  };

  const handleReject = async (id, remarks) => {
    try {
      setApprovalLoading(true);
      await odRequestAPI.rejectODRequest(id, remarks);
      enqueueSnackbar('OD request rejected', { variant: 'warning' });
      setApprovalOpen(false);
      fetchODRequests();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Rejection failed', { variant: 'error' });
    } finally {
      setApprovalLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await odRequestAPI.deleteODRequest(deleteId);
      enqueueSnackbar('OD request deleted successfully', { variant: 'info' });
      fetchODRequests();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Delete failed', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const getStatusCount = (status) => {
    return odRequests.filter((od) => od.status === status).length;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#f5f7fa',
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#115293' }}>
        <Toolbar sx={{ py: 1.5 }}>
          <Button
            color="inherit"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/dashboard')}
            sx={{
              mr: 2,
              borderRadius: 2,
              px: 2,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Back
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            On-Duty Requests
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search OD requests by reason..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Tabs */}
        <Paper elevation={0} sx={{ mb: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
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

        {/* Results Info */}
        {searchQuery && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
            Found {filteredRequests.length} result(s) for "{searchQuery}"
          </Typography>
        )}

        {/* OD Requests List */}
        {filteredRequests.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              border: '1px solid #e0e0e0',
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchQuery ? 'No OD requests found matching your search' : 'No OD requests found'}
            </Typography>
            {user?.role === 'student' && !searchQuery && (
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
                onDelete={handleDeleteClick}
                onApprove={handleApprovalClick}
                userRole={user?.role}
              />
            ))}
          </Box>
        )}
      </Container>

      {/* Floating Action Button */}
      {user?.role === 'student' && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 64,
            height: 64,
            boxShadow: '0 8px 24px rgba(25, 118, 210, 0.4)',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: '0 12px 32px rgba(25, 118, 210, 0.5)',
            },
            transition: 'all 0.3s',
          }}
          onClick={handleCreateClick}
        >
          <Add sx={{ fontSize: 32 }} />
        </Fab>
      )}

      {/* Dialogs */}
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

      <ApprovalDialog
        open={approvalOpen}
        onClose={() => setApprovalOpen(false)}
        odRequest={selectedOD}
        onApprove={handleApprove}
        onReject={handleReject}
        loading={approvalLoading}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete OD Request?"
        message="This action cannot be undone. Are you sure you want to delete this OD request?"
        confirmText="Delete"
        confirmColor="error"
      />
    </Box>
  );
};

export default ODRequests;
