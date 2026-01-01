import React from 'react';
import { Box, Container, Skeleton, Paper, AppBar, Toolbar } from '@mui/material';

const ODRequestsSkeleton = () => {
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

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Search Bar */}
        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2, mb: 3 }} />

        {/* Tabs */}
        <Paper elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', p: 2 }}>
            {[1, 2, 3, 4].map((item) => (
              <Box key={item} sx={{ flex: 1, textAlign: 'center' }}>
                <Skeleton variant="text" width="80%" height={40} sx={{ mx: 'auto' }} />
              </Box>
            ))}
          </Box>
        </Paper>

        {/* OD Request Cards */}
        {[1, 2, 3].map((item) => (
          <Paper
            key={item}
            elevation={2}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 4,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Skeleton variant="text" width="40%" height={32} />
              <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
            </Box>
            
            <Skeleton variant="text" width="100%" height={60} sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Skeleton variant="text" width={120} height={24} />
              <Skeleton variant="text" width={120} height={24} />
              <Skeleton variant="text" width={100} height={24} />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 2 }} />
            </Box>
          </Paper>
        ))}
      </Container>

      {/* FAB Skeleton */}
      <Skeleton
        variant="circular"
        width={64}
        height={64}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
        }}
      />
    </Box>
  );
};

export default ODRequestsSkeleton;
