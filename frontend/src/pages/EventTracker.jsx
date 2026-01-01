import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  Menu as MenuIcon,
  School,
  Assessment,
  EventNote,
  Event,
  Add,
  CalendarToday,
  AccessTime,
  LocationOn,
  Brightness4,
  Brightness7,
  Delete,
  Edit,
  Info,
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

const STORAGE_KEY = 'acms_events';

const EventTracker = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const { mode, toggleTheme } = useCustomTheme();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'academic',
  });

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Load events from localStorage on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
  }, [events]);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      // Try to load from localStorage first
      const storedEvents = localStorage.getItem(STORAGE_KEY);

      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        // Default mock data if no stored events
        const mockEvents = [
          {
            id: 1,
            title: 'Mid-Term Examination',
            description: 'Mathematics and Physics exams',
            date: '2026-01-15',
            time: '09:00 AM',
            location: 'Main Block, Room 101',
            type: 'exam',
          },
          {
            id: 2,
            title: 'Guest Lecture on AI',
            description: 'Introduction to Machine Learning',
            date: '2026-01-20',
            time: '02:00 PM',
            location: 'Auditorium',
            type: 'academic',
          },
          {
            id: 3,
            title: 'Sports Day',
            description: 'Annual inter-department sports meet',
            date: '2026-01-25',
            time: '08:00 AM',
            location: 'Sports Ground',
            type: 'extracurricular',
          },
        ];
        setEvents(mockEvents);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockEvents));
      }
    } catch (err) {
      enqueueSnackbar('Failed to load events', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleOpenDialog = (event = null) => {
    if (!isAdmin) {
      enqueueSnackbar('Only administrators can manage events', { variant: 'warning' });
      return;
    }

    if (event) {
      setEditMode(true);
      setCurrentEvent(event);
      setFormData(event);
    } else {
      setEditMode(false);
      setCurrentEvent(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: 'academic',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditMode(false);
    setCurrentEvent(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!isAdmin) {
      enqueueSnackbar('Unauthorized action', { variant: 'error' });
      return;
    }

    if (editMode) {
      const updatedEvents = events.map(evt => 
        evt.id === currentEvent.id ? { ...formData, id: evt.id } : evt
      );
      setEvents(updatedEvents);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
      enqueueSnackbar('Event updated successfully', { variant: 'success' });
    } else {
      const newEvent = { ...formData, id: Date.now() };
      const updatedEvents = [newEvent, ...events];
      setEvents(updatedEvents);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
      enqueueSnackbar('Event created successfully', { variant: 'success' });
    }
    handleCloseDialog();
  };

  const handleDelete = (eventId) => {
    if (!isAdmin) {
      enqueueSnackbar('Only administrators can delete events', { variant: 'error' });
      return;
    }
    const updatedEvents = events.filter(evt => evt.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
    enqueueSnackbar('Event deleted', { variant: 'info' });
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'exam':
        return '#f44336';
      case 'academic':
        return '#2196f3';
      case 'extracurricular':
        return '#4caf50';
      default:
        return '#9e9e9e';
    }
  };

  const getEventTypeLabel = (type) => {
    switch (type) {
      case 'exam':
        return 'Examination';
      case 'academic':
        return 'Academic';
      case 'extracurricular':
        return 'Extra-curricular';
      default:
        return 'Other';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 600, letterSpacing: 1 }}
          >
            Event Tracker
          </Typography>
          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Side Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 280, pt: 2 }}>
          <Typography variant="h6" sx={{ px: 3, mb: 2, fontWeight: 700 }}>
            Navigation
          </Typography>
          <Divider />
          <List>
            <ListItem button onClick={() => { navigate('/dashboard'); setDrawerOpen(false); }}>
              <ListItemIcon><School color="primary" /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/attendance'); setDrawerOpen(false); }}>
              <ListItemIcon><School sx={{ color: '#4caf50' }} /></ListItemIcon>
              <ListItemText primary="View Attendance" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/marks'); setDrawerOpen(false); }}>
              <ListItemIcon><Assessment sx={{ color: '#9c27b0' }} /></ListItemIcon>
              <ListItemText primary="View Marks" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/od-requests'); setDrawerOpen(false); }}>
              <ListItemIcon><EventNote sx={{ color: '#ff9800' }} /></ListItemIcon>
              <ListItemText primary="OD Requests" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Admin-Only Notice */}
        {!isAdmin && (
          <Alert 
            severity="info" 
            icon={<Info />}
            sx={{ mb: 3, borderRadius: 2 }}
          >
            You are viewing events in <strong>read-only mode</strong>. Only administrators can add, edit, or delete events.
          </Alert>
        )}

        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Event sx={{ fontSize: 36, color: 'primary.main', mr: 2 }} />
            <Box>
              <Typography variant="h4" fontWeight={700} color="text.primary">
                Event Tracker
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isAdmin ? 'Manage and track your academic events' : 'View upcoming academic events'}
              </Typography>
            </Box>
          </Box>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                borderRadius: 3,
                py: 1.5,
                px: 3,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Add Event
            </Button>
          )}
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card elevation={2} sx={{ borderRadius: 4 }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <EventNote sx={{ fontSize: 48, color: '#2196f3', mb: 1 }} />
                <Typography variant="h3" fontWeight={800} color="text.primary">
                  {events.length}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Total Events
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={2} sx={{ borderRadius: 4 }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Assessment sx={{ fontSize: 48, color: '#f44336', mb: 1 }} />
                <Typography variant="h3" fontWeight={800} color="text.primary">
                  {events.filter(e => e.type === 'exam').length}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Examinations
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={2} sx={{ borderRadius: 4 }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <CalendarToday sx={{ fontSize: 48, color: '#4caf50', mb: 1 }} />
                <Typography variant="h3" fontWeight={800} color="text.primary">
                  {events.filter(e => e.type === 'academic').length}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Academic Events
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Events List */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ mb: 3 }}>
            Upcoming Events
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {events.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Event sx={{ fontSize: 80, color: mode === 'dark' ? '#555555' : '#bdbdbd', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No events scheduled
              </Typography>
              {isAdmin && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Click &quot;Add Event&quot; to create your first event
                </Typography>
              )}
            </Box>
          ) : (
            <Grid container spacing={3}>
              {events.map((event) => (
                <Grid item xs={12} md={6} key={event.id}>
                  <Card
                    elevation={1}
                    sx={{
                      borderRadius: 3,
                      borderLeft: `6px solid ${getEventTypeColor(event.type)}`,
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateX(4px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" fontWeight={700} color="text.primary">
                          {event.title}
                        </Typography>
                        <Chip
                          label={getEventTypeLabel(event.type)}
                          size="small"
                          sx={{
                            bgcolor: getEventTypeColor(event.type),
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {event.description}
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarToday sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {new Date(event.date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTime sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {event.time}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {event.location}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Admin-only action buttons */}
                      {isAdmin && (
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Button
                            size="small"
                            startIcon={<Edit />}
                            onClick={() => handleOpenDialog(event)}
                            sx={{ textTransform: 'none' }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => handleDelete(event.id)}
                            sx={{ textTransform: 'none' }}
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>

      {/* Add/Edit Event Dialog - Admin Only */}
      {isAdmin && (
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editMode ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                fullWidth
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                fullWidth
                label="Time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                placeholder="e.g., 09:00 AM"
              />
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                select
                label="Event Type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                SelectProps={{ native: true }}
              >
                <option value="academic">Academic</option>
                <option value="exam">Examination</option>
                <option value="extracurricular">Extra-curricular</option>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!formData.title || !formData.date}
              sx={{ textTransform: 'none' }}
            >
              {editMode ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default EventTracker;