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
  Divider,
  Chip,
} from '@mui/material';
import { ArrowBack, Assessment, TrendingUp, School, CalendarToday } from '@mui/icons-material';
import marksAPI from '../services/marksAPI';
import MarksTable from '../components/Marks/MarksTable';

const Marks = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [marksData, setMarksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError(null);
    } catch (err) {
      console.error('Marks Error:', err);
      setError(err.response?.data?.message || 'Failed to load marks data');
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
          bgcolor: '#f5f7fa',
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

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
          <Assessment sx={{ mr: 2, fontSize: 28 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Academic Performance
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 5, mb: 6 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* GPA Card */}
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 4,
                height: '100%',
                minHeight: 220,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 5 }}>
                <Assessment sx={{ fontSize: 56, mb: 2, opacity: 0.9 }} />
                <Typography variant="h2" fontWeight="800" sx={{ mb: 1, fontSize: '3.5rem' }}>
                  {marksData?.gpa?.toFixed(2) || '0.00'}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.95, mb: 0.5 }}>
                  Current GPA
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Semester {marksData?.semester || 1}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* CGPA Card */}
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                borderRadius: 4,
                height: '100%',
                minHeight: 220,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 5 }}>
                <TrendingUp sx={{ fontSize: 56, mb: 2, opacity: 0.9 }} />
                <Typography variant="h2" fontWeight="800" sx={{ mb: 1, fontSize: '3.5rem' }}>
                  {marksData?.cgpa?.toFixed(2) || '0.00'}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.95, mb: 0.5 }}>
                  Cumulative CGPA
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Overall Performance
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Subjects Card */}
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                borderRadius: 4,
                height: '100%',
                minHeight: 220,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 5 }}>
                <School sx={{ fontSize: 56, mb: 2, opacity: 0.9 }} />
                <Typography variant="h2" fontWeight="800" sx={{ mb: 1, fontSize: '3.5rem' }}>
                  {marksData?.subjects?.length || 0}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.95, mb: 0.5 }}>
                  Total Subjects
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Current Semester
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Marks Table */}
          <Grid item xs={12}>
            <MarksTable subjects={marksData?.subjects || []} />
          </Grid>

          {/* Last Updated */}
          {marksData?.lastUpdated && (
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: '#fafafa',
                  borderRadius: 3,
                  border: '1px solid #e0e0e0',
                }}
              >
                <CalendarToday sx={{ fontSize: 24, color: '#616161', mb: 1 }} />
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Last Updated
                </Typography>
                <Typography variant="h6" fontWeight="700" sx={{ mt: 0.5 }}>
                  {new Date(marksData.lastUpdated).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Marks;
