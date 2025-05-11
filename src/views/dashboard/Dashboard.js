import React from 'react';
import { Grid, Box, Typography, Card, CardContent, Divider, Container, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import uniImage from '../../assets/images/backgrounds/uni.jpg';
import { IconCalendar, IconFileText, IconUsers, IconSettings } from '@tabler/icons-react';

const Dashboard = () => {
  const today = new Date();
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const formattedDate = today.toLocaleDateString('vi-VN', options);

  const quickActions = [
    {
      title: 'Quản lý lịch thi',
      icon: <IconCalendar size={32} />,
      description: 'Xem và quản lý lịch thi',
      color: '#3f51b5',
      path: '/excel'
    },
    {
      title: 'Quản lý coi thi',
      icon: <IconFileText size={32} />,
      description: 'Quản lý danh sách môn thi',
      color: '#f50057',
      path: '/excel2'
    },
    {
      title: 'Quản lý giảng viên',
      icon: <IconUsers size={32} />,
      description: 'Quản lý tài khoản người dùng',
      color: '#4caf50',
      path: '/teacher'
    },
    {
      title: 'Lịch thi',
      icon: <IconSettings size={32} />,
      description: 'Cấu hình hệ thống',
      color: '#ff9800',
      path: '/teacher/settings'
    }
  ];

  return (
    <PageContainer title="Dashboard" description="Trang chủ hệ thống quản lý lịch thi">
      <Box>
        {/* Welcome Section */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 4, 
                borderRadius: 2,
                background: 'linear-gradient(45deg, #3f51b5 30%, #7986cb 90%)',
                color: 'white'
              }}
            >
              <Typography variant="h4" gutterBottom>
                Chào mừng đến với Hệ thống Quản lý Lịch thi
              </Typography>
              <Typography variant="subtitle1">
                {formattedDate}
              </Typography>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
              Thao tác nhanh
            </Typography>
            <Grid container spacing={3}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Link 
                    to={action.path}
                    style={{ 
                      textDecoration: 'none',
                      display: 'block',
                      height: '100%'
                    }}
                  >
                    <Card 
                      sx={{ 
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 6,
                          backgroundColor: action.color + '10'
                        }
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 3 }}>
                        <Box sx={{ color: action.color, mb: 2 }}>
                          {action.icon}
                        </Box>
                        <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                          {action.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {action.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Introduction Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Giới thiệu
                </Typography>
                <Typography variant="body1" paragraph>
                  Hệ thống Quản lý Lịch thi là giải pháp toàn diện giúp quản lý và sắp xếp lịch thi một cách hiệu quả. Với các tính năng:
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography component="li" variant="body1" paragraph>
                    Quản lý lịch thi tự động và thông minh
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    Phân bổ phòng thi tối ưu
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    Theo dõi và báo cáo trực quan
                  </Typography>
                  <Typography component="li" variant="body1">
                    Tích hợp với hệ thống quản lý sinh viên
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Image Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
              <Box 
                component="img"
                src={uniImage}
                alt="Trường Đại học Kiến trúc Hà Nội"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              />
            </Card>
          </Grid>

          {/* Footer */}
          <Grid item xs={12}>
            <Box 
              component="footer" 
              sx={{
                py: 4,
                mt: 4,
                textAlign: 'center',
                backgroundColor: (theme) => theme.palette.background.paper,
                boxShadow: 3,
                borderRadius: 2
              }}
            >
              <Container maxWidth="lg">
                <Typography variant="h6" gutterBottom>
                  Trường Đại học Kiến trúc Hà Nội
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  P. Văn Quán, Hà Đông, Hà Nội
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Điện thoại: 024 3854 1616 | Email: info@hau.edu.vn
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  © {new Date().getFullYear()} Hệ thống quản lý lịch thi. All rights reserved.
                </Typography>
              </Container>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
