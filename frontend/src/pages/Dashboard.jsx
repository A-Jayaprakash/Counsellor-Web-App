import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  AppBar,
  Toolbar,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  School,
  Assessment,
  EventNote,
  CheckCircle,
  PendingActions,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { logout, rehydrateAuth } from '../redux/slices/authSlice';
import apiClient from '../services/apiClient';
import StatsCard from '../components/Dashboard/StatsCard';
import AnnouncementsList from '../components/Dashboard/AnnouncementsList';
import DashboardSkeleton from '../components/Skeletons/DashboardSkeleton';


const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        apiClient.get('/dashboard/announcements?limit=5'),
      ]);

      setStats(statsRes.data.stats);
      setAnnouncements(announcementsRes.data.announcements);
      setError(null);
    } catch (err) {
      console.error('Dashboard Error:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getStatsCards = () => {
    if (!stats) return [];

    if (user?.role === 'student') {
      return [
        {
          title: 'Attendance',
          value: `${stats.attendance || 0}%`,
          icon: School,
          color: stats.attendance >= 75 ? '#2e7d32' : '#d32f2f',
          gradient: stats.attendance >= 75 
            ? 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)'
            : 'linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)',
          subtitle: `${stats.classesAttended || 0}/${stats.totalClasses || 0} classes`,
        },
        {
          title: 'Current GPA',
          value: stats.gpa?.toFixed(2) || '0.00',
          icon: Assessment,
          color: '#1976d2',
          gradient: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          subtitle: `Semester ${stats.semester || 1}`,
        },
        {
          title: 'Pending OD Requests',
          value: stats.pendingODs || 0,
          icon: PendingActions,
          color: '#ed6c02',
          gradient: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
          subtitle: `${stats.approvedODs || 0} approved`,
        },
        {
          title: 'Cumulative CGPA',
          value: stats.cgpa?.toFixed(2) || '0.00',
          icon: CheckCircle,
          color: '#7b1fa2',
          gradient: 'linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)',
          subtitle: 'Overall Performance',
        },
      ];
    } else if (user?.role === 'counsellor') {
      return [
        {
          title: 'Assigned Students',
          value: stats.assignedStudents || 0,
          icon: School,
          color: '#1976d2',
          gradient: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          subtitle: 'Under your guidance',
        },
        {
          title: 'Pending OD Requests',
          value: stats.pendingODs || 0,
          icon: PendingActions,
          color: '#ed6c02',
          gradient: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
          subtitle: 'Awaiting approval',
        },
        {
          title: "Today's Requests",
          value: stats.todayODs || 0,
          icon: EventNote,
          color: '#2e7d32',
          gradient: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
          subtitle: 'Submitted today',
        },
        {
          title: 'Total OD Requests',
          value: stats.totalODs || 0,
          icon: Assessment,
          color: '#7b1fa2',
          gradient: 'linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)',
          subtitle: 'All time',
        },
      ];
    } else if (user?.role === 'admin') {
      return [
        {
          title: 'Total Users',
          value: stats.totalUsers || 0,
          icon: School,
          color: '#1976d2',
          gradient: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          subtitle: 'Active accounts',
        },
        {
          title: 'Students',
          value: stats.totalStudents || 0,
          icon: School,
          color: '#2e7d32',
          gradient: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
          subtitle: 'Enrolled students',
        },
        {
          title: 'Counsellors',
          value: stats.totalCounsellors || 0,
          icon: Assessment,
          color: '#ed6c02',
          gradient: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
          subtitle: 'Active counsellors',
        },
        {
          title: 'Announcements',
          value: stats.totalAnnouncements || 0,
          icon: EventNote,
          color: '#7b1fa2',
          gradient: 'linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)',
          subtitle: 'Active posts',
        },
      ];
    }

    return [];
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* Modern AppBar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#115293' }}>
        <Toolbar sx={{ py: 1.5 }}>
          <School sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600, letterSpacing: 0.5 }}>
            ACMS - Academic Counselling Management System
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'capitalize' }}>
                {user?.role}
              </Typography>
            </Box>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                px: 2.5,
                py: 1,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 5, mb: 6 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" fontWeight="700" gutterBottom sx={{ color: '#1a1a1a' }}>
            Welcome back, {user?.firstName}!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.05rem' }}>
            Here's what's happening with your account today.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Stats Cards */}
          {getStatsCards().map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatsCard {...stat} />
            </Grid>
          ))}

          {/* Announcements */}
          <Grid item xs={12} lg={8}>
            <AnnouncementsList announcements={announcements} />
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} lg={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 3,
                border: '1px solid #e0e0e0',
              }}
            >
              <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
                Quick Actions
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {user?.role === 'student' && (
                  <>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<School />}
                      onClick={() => navigate('/attendance')}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        bgcolor: '#1976d2',
                        '&:hover': { bgcolor: '#115293' },
                      }}
                    >
                      View Attendance
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Assessment />}
                      onClick={() => navigate('/marks')}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        bgcolor: '#7b1fa2',
                        '&:hover': { bgcolor: '#6a1b9a' },
                      }}
                    >
                      View Marks
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<EventNote />}
                      onClick={() => navigate('/od-requests')}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderWidth: 2,
                        '&:hover': { borderWidth: 2, bgcolor: 'rgba(25, 118, 210, 0.04)' },
                      }}
                    >
                      OD Requests
                    </Button>
                  </>
                )}
                {user?.role === 'counsellor' && (
                  <>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<School />}
                      onClick={() => navigate('/students')}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                      }}
                    >
                      View Students
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<EventNote />}
                      onClick={() => navigate('/od-requests')}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                      }}
                    >
                      OD Requests
                    </Button>
                  </>
                )}
                {user?.role === 'admin' && (
                  <>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<School />}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                      }}
                    >
                      Manage Users
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<EventNote />}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                      }}
                    >
                      Create Announcement
                    </Button>
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
