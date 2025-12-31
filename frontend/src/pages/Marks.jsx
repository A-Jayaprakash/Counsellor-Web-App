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
} from '@mui/material';
import { ArrowBack, Assessment, TrendingUp, School } from '@mui/icons-material';
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
          <Button color="inherit" startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')}>
            Back
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
            Academic Performance
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}
            >
              <CardContent>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Assessment sx={{ fontSize: 50, mb: 2 }} />
                  <Typography variant="h3" fontWeight="bold">
                    {marksData?.gpa?.toFixed(2) || '0.00'}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Current GPA
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    Semester {marksData?.semester || 1}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
              }}
            >
              <CardContent>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <TrendingUp sx={{ fontSize: 50, mb: 2 }} />
                  <Typography variant="h3" fontWeight="bold">
                    {marksData?.cgpa?.toFixed(2) || '0.00'}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Cumulative CGPA
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    Overall Performance
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
              }}
            >
              <CardContent>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <School sx={{ fontSize: 50, mb: 2 }} />
                  <Typography variant="h3" fontWeight="bold">
                    {marksData?.subjects?.length || 0}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Total Subjects
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    Current Semester
                  </Typography>
                </Box>
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
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                <Typography variant="body2" color="text.secondary">
                  Last Updated: {new Date(marksData.lastUpdated).toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default Marks;
