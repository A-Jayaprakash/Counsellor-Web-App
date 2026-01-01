import React from 'react';
import { Box, Container, Grid, Skeleton, Paper, AppBar, Toolbar } from '@mui/material';

const AttendanceSkeleton = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* AppBar Skeleton */}
      <AppBar position="static" elevation={1} sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Skeleton variant="text" width={180} height={30} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
          </Box>
          <Box sx={{ width: 48 }} />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Overall Attendance Card */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ borderRadius: 4, minHeight: 280, p: 3 }}>
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Skeleton variant="circular" width={64} height={64} sx={{ mx: 'auto', mb: 3 }} />
                <Skeleton variant="text" width="60%" height={60} sx={{ mx: 'auto', mb: 2 }} />
                <Skeleton variant="text" width="80%" height={32} sx={{ mx: 'auto', mb: 1 }} />
                <Skeleton variant="text" width="70%" height={24} sx={{ mx: 'auto' }} />
              </Box>
            </Paper>
          </Grid>

          {/* Stats Cards */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {[1, 2, 3].map((item) => (
                <Grid item xs={12} sm={4} key={item}>
                  <Paper elevation={2} sx={{ borderRadius: 4, p: 3 }}>
                    <Skeleton variant="rectangular" width={56} height={56} sx={{ borderRadius: 2, mx: 'auto', mb: 2 }} />
                    <Skeleton variant="text" width="60%" height={40} sx={{ mx: 'auto', mb: 1 }} />
                    <Skeleton variant="text" width="80%" height={20} sx={{ mx: 'auto' }} />
                  </Paper>
                </Grid>
              ))}
              
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
                  <Skeleton variant="text" width={120} height={24} sx={{ mx: 'auto', mb: 1 }} />
                  <Skeleton variant="text" width={100} height={20} sx={{ mx: 'auto', mb: 0.5 }} />
                  <Skeleton variant="text" width={140} height={32} sx={{ mx: 'auto' }} />
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Subject-wise Attendance */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Skeleton variant="circular" width={28} height={28} sx={{ mr: 1.5 }} />
                <Skeleton variant="text" width={250} height={32} />
              </Box>
              <Skeleton variant="rectangular" width="100%" height={1} sx={{ mb: 3 }} />
              
              {[1, 2, 3, 4].map((item) => (
                <Paper
                  key={item}
                  elevation={0}
                  sx={{ p: 3, mb: 2, bgcolor: '#fafafa', borderRadius: 3 }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Skeleton variant="text" width={200} height={28} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width={150} height={20} />
                    </Box>
                    <Skeleton variant="text" width={80} height={40} />
                  </Box>
                  <Skeleton variant="rectangular" width="100%" height={12} sx={{ borderRadius: 6 }} />
                </Paper>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AttendanceSkeleton;
