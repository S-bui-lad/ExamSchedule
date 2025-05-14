import React, { useState, useEffect } from 'react';
import { 
  Grid, Box, Typography, Card, CardContent, Divider, Container, Paper, 
  Button, CircularProgress, Pagination, Stack
} from '@mui/material';
import { Link } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import uniImage from '../../assets/images/backgrounds/uni.jpg';
import { IconCalendar, IconFileText, IconUsers, IconSettings, IconHistory, IconDownload } from '@tabler/icons-react';

// Import the ExcelResultDisplay component
import ExcelResultDisplay from '../excel/ExcelResultDisplay';
import '../excel/display.css'; // Import styles if needed

const Dashboard = () => {
  const today = new Date();
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const formattedDate = today.toLocaleDateString('vi-VN', options);

  // States for exam schedule history
  const [processedResult, setProcessedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  
  // Modal states for room details
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');

  // Fetch exam schedule history on component mount
  useEffect(() => {
    fetchExamHistory();
  }, []);

  // Update processed result when page changes
  useEffect(() => {
    if (fullData.length > 0) {
      const paginatedData = getPaginatedData();
      const formattedResult = formatHistoryData(paginatedData);
      setProcessedResult(formattedResult);
    }
  }, [currentPage, fullData]);

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return fullData.slice(startIndex, endIndex);
  };

  // Fetch exam schedule history from API
  const fetchExamHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://172.20.10.2:8080/history');
      if (!response.ok) {
        throw new Error('Failed to fetch exam history');
      }
      
      const data = await response.json();
      setFullData(data);
      
      // Calculate total pages
      setTotalPages(Math.ceil(data.length / itemsPerPage));
      
      // Format data for ExcelResultDisplay component (only first page)
      const paginatedData = data.slice(0, itemsPerPage);
      const formattedResult = formatHistoryData(paginatedData);
      setProcessedResult(formattedResult);
    } catch (err) {
      console.error('Error fetching exam history:', err);
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Format history data for the ExcelResultDisplay component
  const formatHistoryData = (data) => {
    // Create a downloadable blob from the data
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const downloadUrl = URL.createObjectURL(blob);
    
    return {
      totalRecords: fullData.length,
      displayedRecords: data.length,
      successCount: data.length,
      errorCount: 0,
      processedData: {
        headers: ['Môn học', 'Phòng thi', 'Ngày thi', 'Ca thi'],
        rows: data.map(schedule => [
          schedule.subject ? schedule.subject : 'N/A',
          schedule.rooms && schedule.rooms.length > 0 ? 
            <button 
              className="room-list-button"
              onClick={() => {
                setSelectedRooms(schedule.rooms);
                setSelectedSubject(schedule.subject);
                setShowRoomModal(true);
              }}
            >
              Xem danh sách phòng ({schedule.rooms.length} phòng)
            </button> : 'N/A',
          formatDate(schedule.examDate),
          schedule.shift || 'N/A'
        ])
      },
      logs: [
        {
          message: `Hiển thị ${data.length} lịch thi (trang ${currentPage}/${totalPages})`,
          timestamp: new Date().toLocaleString('vi-VN'),
          type: 'info'
        }
      ],
      downloadUrl: downloadUrl,
      rawData: data,
      onRoomListClick: (rooms, subjectName) => {
        setSelectedRooms(rooms);
        setSelectedSubject(subjectName);
        setShowRoomModal(true);
      }
    };
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleDownload = () => {
    if (processedResult && processedResult.downloadUrl) {
      // Create a temporary link and trigger download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = processedResult.downloadUrl;
      a.download = 'lich_thi.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(processedResult.downloadUrl);
      document.body.removeChild(a);
    }
  };

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
      description: 'Xem lại lịch sử sắp xếp',
      color: '#ff9800',
      path: '/history'
    }
  ];

  return (
    <PageContainer title="Dashboard" description="Trang chủ hệ thống quản lý lịch thi">
      <Box>
        <Grid container spacing={3}>
          {/* Welcome Section */}
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

      {/* Room List Modal */}
      {showRoomModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Danh sách phòng thi - {selectedSubject}</h2>
              <button 
                className="close-button"
                onClick={() => setShowRoomModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <table className="room-list-table">
                <thead>
                  <tr>
                    <th>Mã phòng</th>
                    <th>Sức chứa</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRooms.map((room, index) => (
                    <tr key={index}>
                      <td>{room.name}</td>
                      <td>{room.capacity}</td>
                      <td>{room.note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Dashboard;