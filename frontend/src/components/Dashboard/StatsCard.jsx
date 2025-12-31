import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const StatsCard = ({ title, value, icon: Icon, gradient, subtitle }) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 3,
        background: gradient,
        color: 'white',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(255,255,255,0.1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardContent sx={{ p: 3.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {title}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {Icon && <Icon sx={{ fontSize: 28 }} />}
          </Box>
        </Box>
        
        <Typography variant="h3" fontWeight="800" sx={{ mb: 1, lineHeight: 1 }}>
          {value}
        </Typography>
        
        {subtitle && (
          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
