import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Divider,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { format } from 'date-fns';
import StatusBadge from './StatusBadge';

const ApprovalDialog = ({ open, onClose, odRequest, onApprove, onReject, loading }) => {
  const [remarks, setRemarks] = useState('');
  const [action, setAction] = useState(null); // 'approve' or 'reject'
  const [error, setError] = useState('');

  const handleAction = (actionType) => {
    setAction(actionType);
    setError('');
  };

  const handleSubmit = () => {
    if (action === 'reject' && !remarks.trim()) {
      setError('Remarks are required for rejection');
      return;
    }

    if (action === 'approve') {
      onApprove(odRequest._id, remarks);
    } else {
      onReject(odRequest._id, remarks);
    }
  };

  const handleClose = () => {
    setRemarks('');
    setAction(null);
    setError('');
    onClose();
  };

  if (!odRequest) return null;

  const daysDiff = Math.ceil(
    (new Date(odRequest.endDate) - new Date(odRequest.startDate)) / (1000 * 60 * 60 * 24)
  ) + 1;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Review OD Request</Typography>
          <StatusBadge status={odRequest.status} />
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Student Info */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Student Information
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {odRequest.studentId?.firstName} {odRequest.studentId?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {odRequest.studentId?.email}
          </Typography>
          {odRequest.studentId?.enrollmentNo && (
            <Typography variant="body2" color="text.secondary">
              Enrollment: {odRequest.studentId.enrollmentNo}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Request Details */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Reason for On-Duty
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>
              {odRequest.reason}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">
              Start Date
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {format(new Date(odRequest.startDate), 'dd MMM yyyy')}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">
              End Date
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {format(new Date(odRequest.endDate), 'dd MMM yyyy')}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">
              Duration
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {daysDiff} day{daysDiff > 1 ? 's' : ''}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Submitted On
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {format(new Date(odRequest.createdAt), 'dd MMM yyyy, HH:mm')}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Action Selection */}
        {odRequest.status === 'pending' && (
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Take Action
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button
                variant={action === 'approve' ? 'contained' : 'outlined'}
                color="success"
                fullWidth
                startIcon={<CheckCircle />}
                onClick={() => handleAction('approve')}
                disabled={loading}
              >
                Approve
              </Button>
              <Button
                variant={action === 'reject' ? 'contained' : 'outlined'}
                color="error"
                fullWidth
                startIcon={<Cancel />}
                onClick={() => handleAction('reject')}
                disabled={loading}
              >
                Reject
              </Button>
            </Box>

            {action && (
              <TextField
                label={`Remarks ${action === 'reject' ? '(Required)' : '(Optional)'}`}
                multiline
                rows={3}
                fullWidth
                value={remarks}
                onChange={(e) => {
                  setRemarks(e.target.value);
                  setError('');
                }}
                placeholder={
                  action === 'approve'
                    ? 'Add any comments (optional)'
                    : 'Please provide reason for rejection'
                }
                required={action === 'reject'}
              />
            )}
          </Box>
        )}

        {/* Existing Remarks */}
        {odRequest.counsellorRemarks && odRequest.status !== 'pending' && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Counsellor's Remarks
            </Typography>
            <Typography variant="body2">{odRequest.counsellorRemarks}</Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Close
        </Button>
        {odRequest.status === 'pending' && action && (
          <Button
            variant="contained"
            color={action === 'approve' ? 'success' : 'error'}
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {action === 'approve' ? 'Approve Request' : 'Reject Request'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ApprovalDialog;
