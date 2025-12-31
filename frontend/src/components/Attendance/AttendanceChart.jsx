import React from 'react';
import { Box, Typography, LinearProgress, Card, CardContent } from '@mui/material';

const AttendanceChart = ({ subjects = [] }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Subject-wise Attendance
        </Typography>

        {subjects.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
            No attendance data available
          </Typography>
        ) : (
          <Box sx={{ mt: 2 }}>
            {subjects.map((subject, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" fontWeight="medium">
                    {subject.name} ({subject.code})
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color={subject.percentage >= 75 ? 'success.main' : 'error.main'}
                  >
                    {subject.percentage?.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={subject.percentage || 0}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor:
                        subject.percentage >= 75 ? '#4caf50' : '#f44336',
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {subject.attended}/{subject.classes} classes attended
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceChart;
