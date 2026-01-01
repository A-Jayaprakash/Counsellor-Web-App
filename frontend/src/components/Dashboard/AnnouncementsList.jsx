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
import { Campaign, CalendarToday } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const priorityColors = {
  low: 'default',
  medium: 'warning',
  high: 'error',
};

const AnnouncementsList = ({ announcements = [] }) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 3,
        border: '1px solid #e0e0e0',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Campaign sx={{ mr: 1.5, color: '#1976d2', fontSize: 28 }} />
          <Typography variant="h6" fontWeight="700">
            Recent Announcements
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {announcements.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Campaign sx={{ fontSize: 64, color: '#bdbdbd', mb: 2 }} />
            <Typography variant="body1" color="text.secondary" fontWeight={500}>
              No announcements available
            </Typography>
          </Box>
        ) : (
          <List sx={{ maxHeight: 450, overflow: 'auto', px: 0 }}>
            {announcements.map((announcement, index) => (
              <React.Fragment key={announcement._id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    px: 2.5,
                    py: 2.5,
                    borderRadius: 2,
                    mb: 1.5,
                    bgcolor: '#fafafa',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ flex: 1 }}>
                          {announcement.title}
                        </Typography>
                        <Chip
                          label={announcement.priority?.toUpperCase()}
                          size="small"
                          color={priorityColors[announcement.priority]}
                          sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{ mb: 1.5, lineHeight: 1.6 }}
                        >
                          {announcement.content}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday sx={{ fontSize: 14, color: '#fafafa' }} />
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            {announcement.adminId?.firstName} {announcement.adminId?.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            •
                          </Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            {formatDistanceToNow(new Date(announcement.createdAt), {
                              addSuffix: true,
                            })}
                          </Typography>
                        </Box>
                      </>
                    }
                  />
                </ListItem>
                {index < announcements.length - 1 && <Divider sx={{ my: 0 }} />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnouncementsList;
