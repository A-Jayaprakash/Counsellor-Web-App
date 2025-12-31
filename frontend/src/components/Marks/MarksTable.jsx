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
} from '@mui/material';

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
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Subject-wise Marks
        </Typography>

        {subjects.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
            No marks data available
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell><strong>Subject</strong></TableCell>
                  <TableCell align="center"><strong>Code</strong></TableCell>
                  <TableCell align="center"><strong>Internal</strong></TableCell>
                  <TableCell align="center"><strong>External</strong></TableCell>
                  <TableCell align="center"><strong>Total</strong></TableCell>
                  <TableCell align="center"><strong>Percentage</strong></TableCell>
                  <TableCell align="center"><strong>Grade</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map((subject, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{subject.name}</TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {subject.code}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{subject.internalMarks}</TableCell>
                    <TableCell align="center">{subject.externalMarks}</TableCell>
                    <TableCell align="center">
                      <strong>{subject.totalMarks}/{subject.maxMarks}</strong>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color={
                          calculatePercentage(subject.totalMarks, subject.maxMarks) >= 75
                            ? 'success.main'
                            : calculatePercentage(subject.totalMarks, subject.maxMarks) >= 60
                            ? 'warning.main'
                            : 'error.main'
                        }
                      >
                        {calculatePercentage(subject.totalMarks, subject.maxMarks)}%
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={subject.grade}
                        color={gradeColors[subject.grade] || 'default'}
                        size="small"
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
