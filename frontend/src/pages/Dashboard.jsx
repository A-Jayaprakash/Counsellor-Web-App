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
} from '@mui/material';
import {
  School,
  Assessment,
  EventNote,
  CheckCircle,
  PendingActions,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { logout } from '../redux/slices/authSlice';
import dashboardAPI from '../services/dashboardAPI';
import StatsCard from '../components/Dashboard/StatsCard';
import AnnouncementsList from '../components/Dashboard/AnnouncementsList';

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

    fetchDashboardData();
  }, [isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, announcementsData] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getAnnouncements(5),
      ]);

      setStats(statsData.stats);
      setAnnouncements(announcementsData.announcements);
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
          color: stats.attendance >= 75 ? '#4caf50' : '#f44336',
          subtitle: `${stats.classesAttended}/${stats.totalClasses} classes`,
        },
        {
          title: 'GPA',
          value: stats.gpa?.toFixed(2) || '0.00',
          icon: Assessment,
          color: '#2196f3',
          subtitle: `Semester ${stats.semester || 1}`,
        },
        {
          title: 'Pending ODs',
          value: stats.pendingODs || 0,
          icon: PendingActions,
          color: '#ff9800',
          subtitle: `${stats.approvedODs || 0} approved`,
        },
        {
          title: 'CGPA',
          value: stats.cgpa?.toFixed(2) || '0.00',
          icon: CheckCircle,
          color: '#9c27b0',
          subtitle: 'Overall',
        },
      ];
    } else if (user?.role === 'counsellor') {
      return [
        {
          title: 'Assigned Students',
          value: stats.assignedStudents || 0,
          icon: School,
          color: '#2196f3',
        },
        {
          title: 'Pending OD Requests',
          value: stats.pendingODs || 0,
          icon: PendingActions,
          color: '#ff9800',
        },
        {
          title: "Today's Requests",
          value: stats.todayODs || 0,
          icon: EventNote,
          color: '#4caf50',
        },
        {
          title: 'Total ODs',
          value: stats.totalODs || 0,
          icon: Assessment,
          color: '#9c27b0',
        },
      ];
    } else if (user?.role === 'admin') {
      return [
        {
          title: 'Total Users',
          value: stats.totalUsers || 0,
          icon: School,
          color: '#2196f3',
        },
        {
          title: 'Students',
          value: stats.totalStudents || 0,
          icon: School,
          color: '#4caf50',
        },
        {
          title: 'Counsellors',
          value: stats.totalCounsellors || 0,
          icon: Assessment,
          color: '#ff9800',
        },
        {
          title: 'Active Announcements',
          value: stats.totalAnnouncements || 0,
          icon: EventNote,
          color: '#9c27b0',
        },
      ];
    }

    return [];
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ACMS - Academic Counselling Management System
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.firstName} {user?.lastName} ({user?.role})
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome back, {user?.firstName}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your account today.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Stats Cards */}
          {getStatsCards().map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatsCard {...stat} />
            </Grid>
          ))}

          {/* Announcements */}
          <Grid item xs={12} md={8}>
            <AnnouncementsList announcements={announcements} />
          </Grid>
          {/* Quick Actions */}
<Grid item xs={12} md={4}>
  <Paper sx={{ p: 3, height: '100%' }}>
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      Quick Actions
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      {user?.role === 'student' && (
        <>
          <Button
            variant="contained"
            fullWidth
            startIcon={<School />}
            onClick={() => navigate('/attendance')}
          >
            View Attendance
          </Button>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Assessment />}
            onClick={() => navigate('/marks')}
          >
            View Marks
          </Button>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<EventNote />}
            onClick={() => navigate('/od-requests')}
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
          >
            View Students
          </Button>
          <Button
            variant="contained"
            fullWidth
            startIcon={<EventNote />}
            onClick={() => navigate('/od-requests')}
          >
            OD Requests
          </Button>
        </>
      )}
      {user?.role === 'admin' && (
        <>
          <Button variant="contained" fullWidth startIcon={<School />}>
            Manage Users
          </Button>
          <Button variant="contained" fullWidth startIcon={<EventNote />}>
            Create Announcement
          </Button>
        </>
      )}
    </Box>
  </Paper>
</Grid>

        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;
