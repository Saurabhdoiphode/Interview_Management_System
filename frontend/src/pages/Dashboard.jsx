import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  Work,
  People,
  TrendingUp,
  CheckCircle,
} from '@mui/icons-material';
import { useAppSelector } from '../hooks/useRedux';
import { UserRole } from '../types';

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);

  const getDashboardStats = () => {
    return [
      { title: 'Open Positions', value: '12', icon: <Work />, color: '#0ea5e9' },
      { title: 'Candidates', value: '248', icon: <People />, color: '#10b981' },
      { title: 'Interviews Today', value: '5', icon: <TrendingUp />, color: '#f59e0b' },
      { title: 'Offers Sent', value: '23', icon: <CheckCircle />, color: '#8b5cf6' },
    ];
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Welcome, {user?.firstName || 'User'}!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Here's what's happening with your Interview Management System
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {getDashboardStats().map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}10 100%)`,
                border: `1px solid ${stat.color}30`,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ color: stat.color, fontWeight: 'bold' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color, fontSize: 40 }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Recent Activities
            </Typography>
            <Typography color="textSecondary">
              No recent activities yet. Start managing your recruitment process!
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#0ea5e9' } }}>
                → Post New Job
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#0ea5e9' } }}>
                → Schedule Interview
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#0ea5e9' } }}>
                → Send Offer
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#0ea5e9' } }}>
                → View Reports
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
