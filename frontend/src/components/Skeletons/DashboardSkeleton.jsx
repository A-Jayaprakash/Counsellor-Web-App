import React from 'react';
import { Box, Container, Grid, Skeleton, Paper } from '@mui/material';

const DashboardSkeleton = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* AppBar Skeleton */}
      <Skeleton variant="rectangular" height={70} sx={{ mb: 4 }} />

      <Container maxWidth="xl" sx={{ mt: 5, mb: 6 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 5 }}>
          <Skeleton variant="text" width={300} height={50} />
          <Skeleton variant="text" width={400} height={30} />
        </Box>

        <Grid container spacing={4}>
          {/* Stats Cards */}
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Paper elevation={0} sx={{ p: 3.5, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
              </Paper>
            </Grid>
          ))}

          {/* Announcements */}
          <Grid item xs={12} lg={8}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
              <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
              {[1, 2, 3].map((item) => (
                <Box key={item} sx={{ mb: 2 }}>
                  <Skeleton variant="text" width="80%" height={30} />
                  <Skeleton variant="text" width="100%" height={60} />
                  <Skeleton variant="text" width="40%" height={20} />
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} lg={4}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
              <Skeleton variant="text" width={150} height={40} sx={{ mb: 3 }} />
              {[1, 2, 3].map((item) => (
                <Skeleton
                  key={item}
                  variant="rectangular"
                  height={48}
                  sx={{ mb: 2.5, borderRadius: 2 }}
                />
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardSkeleton;
