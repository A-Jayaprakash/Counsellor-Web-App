import React from 'react';
import { Box, Container, Grid, Skeleton, Paper, AppBar, Toolbar } from '@mui/material';

const DashboardSkeleton = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* AppBar Skeleton */}
      <AppBar position="static" elevation={1} sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
          </Box>
          <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Left Section */}
          <Box sx={{ flex: '0 0 65%' }}>
            {/* 4 Stat Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {[1, 2, 3, 4].map((item) => (
                <Grid item xs={12} sm={6} key={item}>
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 4, height: 180 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Skeleton variant="text" width={100} height={20} />
                      <Skeleton variant="circular" width={32} height={32} />
                    </Box>
                    <Skeleton variant="text" width="60%" height={60} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" height={20} />
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Counsellor Details */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={28} height={28} sx={{ mr: 1.5 }} />
                <Skeleton variant="text" width={180} height={32} />
              </Box>
              <Skeleton variant="rectangular" width="100%" height={1} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={20} />
            </Paper>
          </Box>

          {/* Right Section - Recent Updates */}
          <Box sx={{ flex: '0 0 calc(35% - 24px)' }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4, minHeight: 660 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={28} height={28} sx={{ mr: 1.5 }} />
                <Skeleton variant="text" width={150} height={32} />
              </Box>
              <Skeleton variant="rectangular" width="100%" height={1} sx={{ mb: 3 }} />
              
              {[1, 2, 3, 4].map((item) => (
                <Box key={item} sx={{ mb: 2, p: 2.5, bgcolor: '#f9f9f9', borderRadius: 2 }}>
                  <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="100%" height={40} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="40%" height={16} />
                </Box>
              ))}
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardSkeleton;
