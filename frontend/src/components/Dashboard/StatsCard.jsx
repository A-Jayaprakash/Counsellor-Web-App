import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const StatsCard = ({ title, value, icon: Icon, color = 'primary.main', subtitle }) => {
  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="text.secondary" variant="subtitle2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight="bold" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: '12px',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {Icon && <Icon sx={{ fontSize: 32, color: 'white' }} />}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
