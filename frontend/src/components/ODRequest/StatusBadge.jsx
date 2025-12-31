import React from 'react';
import { Chip } from '@mui/material';
import { CheckCircle, HourglassEmpty, Cancel } from '@mui/icons-material';

const statusConfig = {
  pending: {
    color: 'warning',
    icon: HourglassEmpty,
    label: 'Pending',
  },
  approved: {
    color: 'success',
    icon: CheckCircle,
    label: 'Approved',
  },
  rejected: {
    color: 'error',
    icon: Cancel,
    label: 'Rejected',
  },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Chip
      icon={<Icon />}
      label={config.label}
      color={config.color}
      size="small"
      sx={{ fontWeight: 'bold' }}
    />
  );
};

export default StatusBadge;
