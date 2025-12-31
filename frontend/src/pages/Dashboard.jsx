import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  CircularProgress,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  School,
  Assessment,
  CheckCircle,
  PendingActions,
  Logout as LogoutIcon,
  Person,
  Campaign,
  EventNote,
} from '@mui/icons-material';
import { logout, rehydrateAuth } from '../redux/slices/authSlice';
import apiClient from '../services/apiClient';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!user && isAuthenticated) {
      dispatch(rehydrateAuth());
    }

    fetchDashboardData();
  }, [isAuthenticated, user, navigate, dispatch]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [statsRes, announcementsRes] = await Promise.all([
        apiClient.get('/dashboard/stats'),
        apiClient.get('/dashboard/announcements?limit=10'),
      ]);

      setStats(statsRes.data.stats);
      setAnnouncements(announcementsRes.data.announcements);
    } catch (err) {
      console.error('Dashboard Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const iconColors = {
    attendance: '#4caf50',
    gpa: '#2196f3',
    pending: '#ff9800',
    cgpa: '#9c27b0',
  };

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
            ACMS
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person />
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {user?.role}
              </Typography>
            </Box>
            <IconButton color="inherit" onClick={handleLogout} sx={{ ml: 1 }}>
              <LogoutIcon />
            </IconButton>
          </Box>
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
                navigate('/attendance');
                setDrawerOpen(false);
              }}
            >
              <ListItemIcon>
                <School color="primary" />
              </ListItemIcon>
              <ListItemText primary="View Attendance" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                navigate('/marks');
                setDrawerOpen(false);
              }}
            >
              <ListItemIcon>
                <Assessment sx={{ color: '#9c27b0' }} />
              </ListItemIcon>
              <ListItemText primary="View Marks" />
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

      {/* Main Content - Using Flexbox for Better Control */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* LEFT SECTION - Stats Cards + Counsellor */}
          <Box sx={{ flex: '0 0 65%' }}>
            {/* 4 Stat Cards Grid */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {/* Attendance */}
              <Grid item xs={12} sm={6}>
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 4,
                    height: 180,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          color: '#757575',
                          letterSpacing: 0.5,
                        }}
                      >
                        Attendance
                      </Typography>
                      <School sx={{ fontSize: 32, color: iconColors.attendance }} />
                    </Box>
                    <Typography variant="h2" fontWeight="800" sx={{ mb: 1, color: '#1a1a1a' }}>
                      {stats?.attendance || 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
                      {stats?.classesAttended || 0}/{stats?.totalClasses || 0} classes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Current GPA */}
              <Grid item xs={12} sm={6}>
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 4,
                    height: 180,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          color: '#757575',
                          letterSpacing: 0.5,
                        }}
                      >
                        Current GPA
                      </Typography>
                      <Assessment sx={{ fontSize: 32, color: iconColors.gpa }} />
                    </Box>
                    <Typography variant="h2" fontWeight="800" sx={{ mb: 1, color: '#1a1a1a' }}>
                      {stats?.gpa?.toFixed(2) || '0.00'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
                      Semester {stats?.semester || 1}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Pending OD */}
              <Grid item xs={12} sm={6}>
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 4,
                    height: 180,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          color: '#757575',
                          letterSpacing: 0.5,
                        }}
                      >
                        Pending OD
                      </Typography>
                      <PendingActions sx={{ fontSize: 32, color: iconColors.pending }} />
                    </Box>
                    <Typography variant="h2" fontWeight="800" sx={{ mb: 1, color: '#1a1a1a' }}>
                      {stats?.pendingODs || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
                      {stats?.approvedODs || 0} Approved
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Cumulative CGPA */}
              <Grid item xs={12} sm={6}>
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 4,
                    height: 180,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          color: '#757575',
                          letterSpacing: 0.5,
                        }}
                      >
                        Cumulative CGPA
                      </Typography>
                      <CheckCircle sx={{ fontSize: 32, color: iconColors.cgpa }} />
                    </Box>
                    <Typography variant="h2" fontWeight="800" sx={{ mb: 1, color: '#1a1a1a' }}>
                      {stats?.cgpa?.toFixed(2) || '0.00'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
                      Overall Performance
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Counsellor Details */}
            <Card elevation={2} sx={{ borderRadius: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person sx={{ mr: 1.5, color: '#1976d2', fontSize: 28 }} />
                  <Typography variant="h6" fontWeight="700" color="text.primary">
                    Counsellor Details
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {user?.counsellorId ? (
                  <Box>
                    <Typography variant="body1" fontWeight={600} gutterBottom color="text.primary">
                      Name: {user.counsellorId.firstName} {user.counsellorId.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Email: {user.counsellorId.email}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No counsellor assigned yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* RIGHT SECTION - Recent Updates (Independent) */}
          <Box sx={{ flex: '0 0 calc(35% - 24px)' }}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 4,
                height: '100%',
                minHeight: 660,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Campaign sx={{ mr: 1.5, color: '#1976d2', fontSize: 28 }} />
                <Typography variant="h6" fontWeight="700" color="text.primary">
                  Recent Updates
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {announcements.length === 0 ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 10,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Campaign sx={{ fontSize: 80, color: '#bdbdbd', mb: 2, mx: 'auto' }} />
                  <Typography variant="body1" color="text.secondary">
                    No announcements available
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ flex: 1, overflow: 'auto', pr: 1 }}>
                  {announcements.map((announcement, index) => (
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        p: 2.5,
                        mb: 2,
                        bgcolor: '#f9f9f9',
                        borderRadius: 2,
                        borderLeft: '4px solid #1976d2',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: '#f0f0f0',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="700" gutterBottom color="text.primary">
                        {announcement.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.6 }}>
                        {announcement.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
