import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { Warning } from '@mui/icons-material';

const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmText = 'Delete', confirmColor = 'error' }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogContent sx={{ pt: 4, pb: 2, textAlign: 'center' }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: confirmColor === 'error' ? '#ffebee' : '#fff3e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <Warning sx={{ fontSize: 36, color: confirmColor === 'error' ? '#d32f2f' : '#ed6c02' }} />
        </Box>
        <Typography variant="h6" fontWeight="700" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" fullWidth sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color={confirmColor} fullWidth sx={{ borderRadius: 2 }}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
