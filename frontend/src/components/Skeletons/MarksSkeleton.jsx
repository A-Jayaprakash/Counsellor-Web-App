import React from 'react';
import { Box, Container, Grid, Skeleton, Paper, AppBar, Toolbar } from '@mui/material';

const MarksSkeleton = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* AppBar Skeleton */}
      <AppBar position="static" elevation={1} sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Skeleton variant="text" width={220} height={30} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
          </Box>
          <Box sx={{ width: 48 }} />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* 4 Stat Cards */}
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Paper elevation={2} sx={{ borderRadius: 4, minHeight: 200, p: 3 }}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Skeleton variant="circular" width={56} height={56} sx={{ mx: 'auto', mb: 2 }} />
                  <Skeleton variant="text" width="50%" height={48} sx={{ mx: 'auto', mb: 1 }} />
                  <Skeleton variant="text" width="70%" height={28} sx={{ mx: 'auto', mb: 0.5 }} />
                  <Skeleton variant="text" width="60%" height={20} sx={{ mx: 'auto' }} />
                </Box>
              </Paper>
            </Grid>
          ))}

          {/* Marks Table */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Skeleton variant="circular" width={28} height={28} sx={{ mr: 1.5 }} />
                <Skeleton variant="text" width={200} height={32} />
              </Box>
              <Skeleton variant="rectangular" width="100%" height={1} sx={{ mb: 3 }} />
              
              {/* Table Header */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2, p: 2, bgcolor: '#fafafa', borderRadius: 2 }}>
                <Skeleton variant="text" width="25%" height={24} />
                <Skeleton variant="text" width="15%" height={24} />
                <Skeleton variant="text" width="15%" height={24} />
                <Skeleton variant="text" width="15%" height={24} />
                <Skeleton variant="text" width="15%" height={24} />
                <Skeleton variant="text" width="15%" height={24} />
              </Box>
              
              {/* Table Rows */}
              {[1, 2, 3, 4].map((item) => (
                <Box key={item} sx={{ display: 'flex', gap: 2, mb: 2, p: 2 }}>
                  <Skeleton variant="text" width="25%" height={24} />
                  <Skeleton variant="text" width="15%" height={24} />
                  <Skeleton variant="text" width="15%" height={24} />
                  <Skeleton variant="text" width="15%" height={24} />
                  <Skeleton variant="text" width="15%" height={24} />
                  <Skeleton variant="rectangular" width="15%" height={32} sx={{ borderRadius: 2 }} />
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MarksSkeleton;
