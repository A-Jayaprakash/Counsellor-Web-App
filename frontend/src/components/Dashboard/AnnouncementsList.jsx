import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { formatDistanceToNow } from 'date-fns';

const priorityColors = {
  low: 'default',
  medium: 'warning',
  high: 'error',
};

const AnnouncementsList = ({ announcements = [] }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AnnouncementIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight="bold">
            Recent Announcements
          </Typography>
        </Box>

        {announcements.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
            No announcements available
          </Typography>
        ) : (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {announcements.map((announcement, index) => (
              <React.Fragment key={announcement._id}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {announcement.title}
                        </Typography>
                        <Chip
                          label={announcement.priority}
                          size="small"
                          color={priorityColors[announcement.priority]}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                          {announcement.content}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {announcement.adminId?.firstName} {announcement.adminId?.lastName} •{' '}
                          {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < announcements.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnouncementsList;
