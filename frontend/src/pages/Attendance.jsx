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
  LinearProgress,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  School,
  CheckCircle,
  Cancel,
  CalendarToday,
  TrendingUp,
  Assessment,
  EventNote,
} from '@mui/icons-material';
import attendanceAPI from '../services/attendanceAPI';
import AttendanceSkeleton from '../components/Skeletons/AttendanceSkeleton';

const Attendance = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();

  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (user?.role === 'student') {
      fetchAttendance();
    } else {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await attendanceAPI.getAttendanceBySubject(user.id);
      setAttendance(data.attendance);
    } catch (err) {
      console.error('Attendance Error:', err);
      enqueueSnackbar(err.response?.data?.message || 'Failed to load attendance data', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return '#4caf50';
    if (percentage >= 75) return '#ff9800';
    return '#f44336';
  };

  if (loading) {
    return <AttendanceSkeleton />;
  }

  const overallPercentage = attendance?.overallPercentage || 0;

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
            Attendance Report
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

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Overall Attendance Card */}
          <Grid item xs={12} md={4}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 4,
                height: '100%',
                minHeight: 280,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 5 }}>
                <School sx={{ fontSize: 64, color: getAttendanceColor(overallPercentage), mb: 3 }} />
                <Typography variant="h2" fontWeight="800" sx={{ mb: 2, color: '#1a1a1a' }}>
                  {overallPercentage.toFixed(1)}%
                </Typography>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                  Overall Attendance
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {attendance?.totalAttended || 0} out of {attendance?.totalClasses || 0} classes
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Stats Cards */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Card elevation={2} sx={{ borderRadius: 4, height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: '#e3f2fd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <CalendarToday sx={{ fontSize: 28, color: '#1976d2' }} />
                    </Box>
                    <Typography variant="h4" fontWeight="800" color="#1976d2" sx={{ mb: 1 }}>
                      {attendance?.totalClasses || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      Total Classes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Card elevation={2} sx={{ borderRadius: 4, height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: '#e8f5e9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 28, color: '#4caf50' }} />
                    </Box>
                    <Typography variant="h4" fontWeight="800" color="#4caf50" sx={{ mb: 1 }}>
                      {attendance?.totalAttended || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      Classes Attended
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Card elevation={2} sx={{ borderRadius: 4, height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: '#ffebee',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <Cancel sx={{ fontSize: 28, color: '#f44336' }} />
                    </Box>
                    <Typography variant="h4" fontWeight="800" color="#f44336" sx={{ mb: 1 }}>
                      {(attendance?.totalClasses || 0) - (attendance?.totalAttended || 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      Classes Missed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
                  <CalendarToday sx={{ fontSize: 24, color: '#757575', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Last Updated
                  </Typography>
                  <Typography variant="h6" fontWeight="700" sx={{ mt: 0.5 }}>
                    {attendance?.lastUpdated
                      ? new Date(attendance.lastUpdated).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Subject-wise Attendance */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUp sx={{ mr: 1.5, color: '#1976d2', fontSize: 28 }} />
                <Typography variant="h5" fontWeight="700">
                  Subject-wise Attendance
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {!attendance?.subjects || attendance.subjects.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <School sx={{ fontSize: 64, color: '#bdbdbd', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No attendance data available
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {attendance.subjects.map((subject, index) => {
                    const percentage = ((subject.attended / subject.total) * 100).toFixed(1);
                    return (
                      <Grid item xs={12} key={index}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            borderRadius: 3,
                            bgcolor: '#fafafa',
                            border: '1px solid #eeeeee',
                            transition: 'all 0.2s',
                            '&:hover': {
                              bgcolor: '#f5f5f5',
                              borderColor: '#e0e0e0',
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 2,
                            }}
                          >
                            <Box>
                              <Typography variant="h6" fontWeight="700">
                                {subject.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {subject.attended}/{subject.total} classes attended
                              </Typography>
                            </Box>
                            <Typography
                              variant="h4"
                              fontWeight="800"
                              sx={{
                                color: getAttendanceColor(percentage),
                              }}
                            >
                              {percentage}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={parseFloat(percentage)}
                            sx={{
                              height: 12,
                              borderRadius: 6,
                              bgcolor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: getAttendanceColor(percentage),
                                borderRadius: 6,
                              },
                            }}
                          />
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Attendance;
