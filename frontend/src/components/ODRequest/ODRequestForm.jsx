import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';

const ODRequestForm = ({ open, onClose, onSubmit, initialData, loading }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        startDate: initialData.startDate?.split('T')[0] || '',
        endDate: initialData.endDate?.split('T')[0] || '',
        reason: initialData.reason || '',
      });
    } else {
      setFormData({
        startDate: '',
        endDate: '',
        reason: '',
      });
    }
    setError('');
  }, [initialData, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      setError('All fields are required');
      return false;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('End date must be after start date');
      return false;
    }

    if (formData.reason.length < 10) {
      setError('Reason must be at least 10 characters');
      return false;
    }

    if (formData.reason.length > 500) {
      setError('Reason must not exceed 500 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit OD Request' : 'Create New OD Request'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
              inputProps={{ min: new Date().toISOString().split('T')[0] }}
            />

            <TextField
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
              inputProps={{ min: formData.startDate || new Date().toISOString().split('T')[0] }}
            />

            <TextField
              label="Reason for On-Duty"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              required
              helperText={`${formData.reason.length}/500 characters`}
              inputProps={{ maxLength: 500 }}
              placeholder="e.g., Attending IEEE Technical Workshop on Machine Learning at IIT Madras"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {initialData ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ODRequestForm;
