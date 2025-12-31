import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
} from '@mui/material';
import { format } from 'date-fns';
import StatusBadge from './StatusBadge';

const ODDetailsDialog = ({ open, onClose, odRequest }) => {
  if (!odRequest) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">OD Request Details</Typography>
          <StatusBadge status={odRequest.status} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Reason
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {odRequest.reason}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Start Date
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {format(new Date(odRequest.startDate), 'dd MMMM yyyy')}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              End Date
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {format(new Date(odRequest.endDate), 'dd MMMM yyyy')}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Submitted On
            </Typography>
            <Typography variant="body2">
              {format(new Date(odRequest.createdAt), 'dd MMM yyyy, HH:mm')}
            </Typography>
          </Grid>

          {odRequest.approvedAt && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Approved On
              </Typography>
              <Typography variant="body2">
                {format(new Date(odRequest.approvedAt), 'dd MMM yyyy, HH:mm')}
              </Typography>
            </Grid>
          )}

          {odRequest.rejectedAt && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Rejected On
              </Typography>
              <Typography variant="body2">
                {format(new Date(odRequest.rejectedAt), 'dd MMM yyyy, HH:mm')}
              </Typography>
            </Grid>
          )}

          {odRequest.studentId && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Student
                </Typography>
                <Typography variant="body2">
                  {odRequest.studentId.firstName} {odRequest.studentId.lastName}
                  {odRequest.studentId.enrollmentNo && ` (${odRequest.studentId.enrollmentNo})`}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {odRequest.studentId.email}
                </Typography>
              </Grid>
            </>
          )}

          {odRequest.counsellorRemarks && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                  Counsellor's Remarks
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    p: 2,
                    bgcolor: odRequest.status === 'rejected' ? 'error.light' : 'success.light',
                    borderRadius: 1,
                    color: odRequest.status === 'rejected' ? 'error.dark' : 'success.dark',
                  }}
                >
                  <Typography variant="body2">{odRequest.counsellorRemarks}</Typography>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ODDetailsDialog;
