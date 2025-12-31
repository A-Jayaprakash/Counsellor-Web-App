import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import { School } from '@mui/icons-material';

const gradeColors = {
  'A+': 'success',
  'A': 'success',
  'B+': 'info',
  'B': 'info',
  'C+': 'warning',
  'C': 'warning',
  'D': 'error',
  'F': 'error',
};

const MarksTable = ({ subjects = [] }) => {
  const calculatePercentage = (total, max) => {
    return ((total / max) * 100).toFixed(1);
  };

  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
          Subject-wise Marks
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {subjects.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <School sx={{ fontSize: 64, color: '#bdbdbd', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              No marks data available
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Subject</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    Code
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    Internal
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    External
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    Total
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    Percentage
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    Grade
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map((subject, index) => (
                  <TableRow
                    key={index}
                    hover
                    sx={{
                      '&:hover': { bgcolor: '#fafafa' },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <TableCell>
                      <Typography variant="body1" fontWeight={600}>
                        {subject.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {subject.code}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1" fontWeight={600}>
                        {subject.internalMarks}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1" fontWeight={600}>
                        {subject.externalMarks}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1" fontWeight={700}>
                        {subject.totalMarks}/{subject.maxMarks}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        fontWeight={700}
                        sx={{
                          color:
                            calculatePercentage(subject.totalMarks, subject.maxMarks) >= 75
                              ? '#2e7d32'
                              : calculatePercentage(subject.totalMarks, subject.maxMarks) >= 60
                              ? '#ed6c02'
                              : '#d32f2f',
                        }}
                      >
                        {calculatePercentage(subject.totalMarks, subject.maxMarks)}%
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={subject.grade}
                        color={gradeColors[subject.grade] || 'default'}
                        size="medium"
                        sx={{ fontWeight: 700, minWidth: 50 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default MarksTable;
