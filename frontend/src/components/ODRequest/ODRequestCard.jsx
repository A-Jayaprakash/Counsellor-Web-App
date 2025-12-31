import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { format } from 'date-fns';
import StatusBadge from './StatusBadge';

const ODRequestCard = ({ odRequest, onView, onEdit, onDelete, userRole }) => {
  const isStudent = userRole === 'student';
  const isPending = odRequest.status === 'pending';
  const canEdit = isStudent && isPending;

  const daysDiff = Math.ceil(
    (new Date(odRequest.endDate) - new Date(odRequest.startDate)) / (1000 * 60 * 60 * 24)
  ) + 1;

  return (
    <Card sx={{ mb: 2, '&:hover': { boxShadow: 4 }, transition: 'all 0.3s' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <StatusBadge status={odRequest.status} />
              <Chip label={`${daysDiff} day${daysDiff > 1 ? 's' : ''}`} size="small" variant="outlined" />
            </Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {odRequest.reason}
            </Typography>
            {!isStudent && (
              <Typography variant="body2" color="text.secondary">
                Student: {odRequest.studentId?.firstName} {odRequest.studentId?.lastName}
                {odRequest.studentId?.enrollmentNo && ` (${odRequest.studentId.enrollmentNo})`}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" color="primary" onClick={() => onView(odRequest)}>
              <Visibility />
            </IconButton>
            {canEdit && (
              <>
                <IconButton size="small" color="info" onClick={() => onEdit(odRequest)}>
                  <Edit />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => onDelete(odRequest._id)}>
                  <Delete />
                </IconButton>
              </>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              From
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {format(new Date(odRequest.startDate), 'dd MMM yyyy')}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            →
          </Typography>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              To
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {format(new Date(odRequest.endDate), 'dd MMM yyyy')}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Submitted
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {format(new Date(odRequest.createdAt), 'dd MMM yyyy')}
            </Typography>
          </Box>
        </Box>

        {odRequest.counsellorRemarks && (
          <Box sx={{ mt: 2, p: 1.5, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
              Counsellor's Remarks:
            </Typography>
            <Typography variant="body2">{odRequest.counsellorRemarks}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ODRequestCard;
