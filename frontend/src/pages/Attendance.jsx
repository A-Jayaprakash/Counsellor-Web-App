import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  AppBar,
  Toolbar,
  LinearProgress,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { ArrowBack, TrendingUp, CalendarToday, CheckCircle, School } from '@mui/icons-material';
import attendanceAPI from '../services/attendanceAPI';

const Attendance = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError(null);
    } catch (err) {
      console.error('Attendance Error:', err);
      setError(err.response?.data?.message || 'Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return '#2e7d32';
    if (percentage >= 75) return '#ed6c02';
    return '#d32f2f';
  };

  const getAttendanceGradient = (percentage) => {
    if (percentage >= 85) return 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)';
    if (percentage >= 75) return 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)';
    return 'linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)';
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

  const overallPercentage = attendance?.overallPercentage || 0;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* AppBar */}
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
          <School sx={{ mr: 2, fontSize: 28 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Attendance Report
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 5, mb: 6 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Overall Attendance Card */}
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                background: getAttendanceGradient(overallPercentage),
                color: 'white',
                borderRadius: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: 320,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 5 }}>
                <School sx={{ fontSize: 64, mb: 3, opacity: 0.9 }} />
                <Typography variant="h2" fontWeight="800" sx={{ mb: 2, fontSize: '4rem' }}>
                  {overallPercentage.toFixed(1)}%
                </Typography>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, opacity: 0.95 }}>
                  Overall Attendance
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  {attendance?.totalAttended || 0} out of {attendance?.totalClasses || 0} classes
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Stats Cards */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: '1px solid #e0e0e0',
                    height: '100%',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3.5 }}>
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
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: '1px solid #e0e0e0',
                    height: '100%',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3.5 }}>
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
                      <CheckCircle sx={{ fontSize: 28, color: '#2e7d32' }} />
                    </Box>
                    <Typography variant="h4" fontWeight="800" color="#2e7d32" sx={{ mb: 1 }}>
                      {attendance?.totalAttended || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      Classes Attended
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: '1px solid #e0e0e0',
                    height: '100%',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3.5 }}>
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
                      <TrendingUp sx={{ fontSize: 28, color: '#d32f2f' }} />
                    </Box>
                    <Typography variant="h4" fontWeight="800" color="#d32f2f" sx={{ mb: 1 }}>
                      {(attendance?.totalClasses || 0) - (attendance?.totalAttended || 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      Classes Missed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #e0e0e0',
                    textAlign: 'center',
                  }}
                >
                  <CalendarToday sx={{ fontSize: 24, color: '#616161', mb: 1 }} />
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
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: '1px solid #e0e0e0',
              }}
            >
              <Typography variant="h5" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
                Subject-wise Attendance
              </Typography>
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
                        <Box
                          sx={{
                            p: 3,
                            borderRadius: 2,
                            bgcolor: '#fafafa',
                            border: '1px solid #eeeeee',
                            transition: 'all 0.2s',
                            '&:hover': {
                              bgcolor: '#f5f5f5',
                              borderColor: '#e0e0e0',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box>
                              <Typography variant="h6" fontWeight="700">
                                {subject.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {subject.attended}/{subject.total} classes attended
                              </Typography>
                            </Box>
                            <Typography
                              variant="h5"
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
                              height: 10,
                              borderRadius: 5,
                              bgcolor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: getAttendanceColor(percentage),
                                borderRadius: 5,
                              },
                            }}
                          />
                        </Box>
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
