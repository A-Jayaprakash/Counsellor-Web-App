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
  Card,
  CardContent,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
} from '@mui/material';
import { ArrowBack, School, CalendarToday } from '@mui/icons-material';
import attendanceAPI from '../services/attendanceAPI';
import AttendanceChart from '../components/Attendance/AttendanceChart';

const Attendance = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [attendanceData, setAttendanceData] = useState(null);
  const [subjects, setSubjects] = useState([]);
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
      const [attendanceRes, subjectsRes] = await Promise.all([
        attendanceAPI.getAttendance(user.id),
        attendanceAPI.getAttendanceBySubject(user.id),
      ]);

      setAttendanceData(attendanceRes.attendance);
      setSubjects(subjectsRes.subjects);
      setError(null);
    } catch (err) {
      console.error('Attendance Error:', err);
      setError(err.response?.data?.message || 'Failed to load attendance data');
    } finally {
      setLoading(false);
    }
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

  const overallPercentage = attendanceData?.percentage || 0;
  const isLowAttendance = overallPercentage < 75;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')}>
            Back
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
            Attendance Report
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {isLowAttendance && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            ⚠️ Your attendance is below 75%. Please improve your attendance to meet requirements.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Overall Attendance Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${
                  isLowAttendance ? '#f44336' : '#4caf50'
                } 0%, ${isLowAttendance ? '#e91e63' : '#66bb6a'} 100%)`,
                color: 'white',
                height: '100%',
              }}
            >
              <CardContent>
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <School sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h2" fontWeight="bold">
                    {overallPercentage.toFixed(1)}%
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Overall Attendance
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
                    {attendanceData?.classesAttended || 0} out of{' '}
                    {attendanceData?.totalClasses || 0} classes
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Stats Cards */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" variant="subtitle2">
                      Total Classes
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {attendanceData?.totalClasses || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" variant="subtitle2">
                      Classes Attended
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {attendanceData?.classesAttended || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" variant="subtitle2">
                      Classes Missed
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="error.main">
                      {(attendanceData?.totalClasses || 0) -
                        (attendanceData?.classesAttended || 0)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography color="text.secondary" variant="caption">
                          Last Updated
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {attendanceData?.lastUpdated
                            ? new Date(attendanceData.lastUpdated).toLocaleDateString()
                            : 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Subject-wise Attendance */}
          <Grid item xs={12}>
            <AttendanceChart subjects={subjects} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Attendance;
