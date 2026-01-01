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
  Card,
  CardContent,
  CircularProgress,
  AppBar,
  Toolbar,
  Divider,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Assessment,
  TrendingUp,
  School,
  CalendarToday,
  EventNote,
} from '@mui/icons-material';
import marksAPI from '../services/marksAPI';
import MarksTable from '../components/Marks/MarksTable';
import MarksSkeleton from '../components/Skeletons/MarksSkeleton';

const Marks = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();

  const [marksData, setMarksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (user?.role === 'student') {
      fetchMarks();
    } else {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const fetchMarks = async () => {
    try {
      setLoading(true);
      const data = await marksAPI.getMarks(user.id);
      setMarksData(data.marks);
    } catch (err) {
      console.error('Marks Error:', err);
      enqueueSnackbar(err.response?.data?.message || 'Failed to load marks data', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (loading) {
    return <MarksSkeleton />;
  }
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* AppBar */}
      <AppBar position="static" elevation={1} sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              textAlign: 'center',
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            Academic Performance
          </Typography>

          <Box sx={{ width: 48 }} />
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
            <ListItem
              button
              onClick={() => {
                navigate('/dashboard');
                setDrawerOpen(false);
              }}
            >
              <ListItemIcon>
                <School color="primary" />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                navigate('/attendance');
                setDrawerOpen(false);
              }}
            >
              <ListItemIcon>
                <School sx={{ color: '#4caf50' }} />
              </ListItemIcon>
              <ListItemText primary="View Attendance" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                navigate('/od-requests');
                setDrawerOpen(false);
              }}
            >
              <ListItemIcon>
                <EventNote sx={{ color: '#ff9800' }} />
              </ListItemIcon>
              <ListItemText primary="OD Requests" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* GPA Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ borderRadius: 4, height: '100%', minHeight: 200 }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Assessment sx={{ fontSize: 56, color: '#2196f3', mb: 2 }} />
                <Typography variant="h3" fontWeight="800" sx={{ mb: 1, color: '#1a1a1a' }}>
                  {marksData?.gpa?.toFixed(2) || '0.00'}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary' }}>
                  Current GPA
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Semester {marksData?.semester || 1}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* CGPA Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ borderRadius: 4, height: '100%', minHeight: 200 }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <TrendingUp sx={{ fontSize: 56, color: '#9c27b0', mb: 2 }} />
                <Typography variant="h3" fontWeight="800" sx={{ mb: 1, color: '#1a1a1a' }}>
                  {marksData?.cgpa?.toFixed(2) || '0.00'}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary' }}>
                  Cumulative CGPA
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Overall Performance
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Subjects Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ borderRadius: 4, height: '100%', minHeight: 200 }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <School sx={{ fontSize: 56, color: '#4caf50', mb: 2 }} />
                <Typography variant="h3" fontWeight="800" sx={{ mb: 1, color: '#1a1a1a' }}>
                  {marksData?.subjects?.length || 0}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary' }}>
                  Total Subjects
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Semester
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Last Updated Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ borderRadius: 4, height: '100%', minHeight: 200 }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <CalendarToday sx={{ fontSize: 56, color: '#ff9800', mb: 2 }} />
                <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 1 }}>
                  Last Updated
                </Typography>
                <Typography variant="h6" fontWeight="700" sx={{ mt: 2 }}>
                  {marksData?.lastUpdated
                    ? new Date(marksData.lastUpdated).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Marks Table */}
          <Grid item xs={12}>
            <MarksTable subjects={marksData?.subjects || []} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Marks;
