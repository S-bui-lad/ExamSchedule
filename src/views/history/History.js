import React, { useState, useEffect } from 'react';
import { 
  Grid, Box, Typography, Card, CardContent, Divider, Container, Paper, 
  Button, CircularProgress, Pagination, Stack, useTheme, useMediaQuery,
  Collapse, IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import uniImage from '../../assets/images/backgrounds/uni.jpg';
import { 
  IconCalendar, IconFileText, IconUsers, IconSettings, 
  IconHistory, IconDownload, IconChevronDown, IconChevronUp 
} from '@tabler/icons-react';
import LogoDark1 from "src/assets/images/logos/Logo_HAU.png";

// Import the ExcelResultDisplay component
import ExcelResultDisplay from '../excel/ExcelResultDisplay';
import '../excel/display.css'; // Import styles if needed

const History = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const today = new Date();
  const options = { 
    weekday: isMobile ? 'short' : 'long', 
    year: 'numeric', 
    month: isMobile ? 'numeric' : 'long', 
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
  
  // Collapsible states
  const [expandedItems, setExpandedItems] = useState({});

  // Toggle expanded/collapsed state for an item
  const toggleItemExpand = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

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
      
      // Reset expanded items when changing page
      setExpandedItems({});
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
        rows: data.map((schedule, index) => [
          schedule.subject ? schedule.subject : 'N/A',
          schedule.rooms && schedule.rooms.length > 0 ? 
            <button 
              className="room-list-button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click event
                setSelectedRooms(schedule.rooms);
                setSelectedSubject(schedule.subject);
                setShowRoomModal(true);
              }}
            >
              {isMobile ? `Xem (${schedule.rooms.length})` : `Xem danh sách phòng (${schedule.rooms.length} phòng)`}
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
      },
      expandedItems: expandedItems,
      toggleItemExpand: toggleItemExpand
    };
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        weekday: isMobile ? 'short' : 'long',
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
      icon: <IconCalendar size={isMobile ? 24 : 32} />,
      description: 'Xem và quản lý lịch thi',
      color: '#3f51b5',
      path: '/excel'
    },
    {
      title: 'Quản lý coi thi',
      icon: <IconFileText size={isMobile ? 24 : 32} />,
      description: 'Quản lý danh sách môn thi',
      color: '#f50057',
      path: '/excel2'
    },
    {
      title: 'Quản lý giảng viên',
      icon: <IconUsers size={isMobile ? 24 : 32} />,
      description: 'Quản lý tài khoản người dùng',
      color: '#4caf50',
      path: '/teacher'
    },
    {
      title: 'Lịch thi',
      icon: <IconSettings size={isMobile ? 24 : 32} />,
      description: 'Cấu hình hệ thống',
      color: '#ff9800',
      path: '/teacher/settings'
    }
  ];

  return (
    <PageContainer title="Dashboard" description="Trang chủ hệ thống quản lý lịch thi">
      <Box sx={{ px: isMobile ? 1 : 3 }}>
        <Grid container spacing={isMobile ? 2 : 3}>
          {/* Mobile Logo */}
          {isMobile && (
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 2,
                  background: 'white',
                  borderRadius: 2,
                  p: 1,
                  boxShadow: 1
                }}
              >
                <img 
                  src={LogoDark1} 
                  alt="HAU Logo" 
                  style={{ 
                    height: 50, 
                    objectFit: 'contain' 
                  }} 
                />
              </Box>
            </Grid>
          )}
          
          {/* Welcome Section */}
          <Grid item xs={12}>
            <Paper 
              elevation={3}
              sx={{ 
                p: isMobile ? 2 : 4, 
                borderRadius: 2,
                background: 'linear-gradient(45deg, #3f51b5 30%, #7986cb 90%)',
                color: 'white'
              }}
            >
              <Typography variant={isMobile ? "body1" : "subtitle1"}>
                {formattedDate}
              </Typography>
            </Paper>
          </Grid>              
          {/* Exam Schedule History Section */}
          <Grid item xs={12}>
            <Paper 
              elevation={3}
              sx={{ 
                mt: isMobile ? 2 : 4,
                p: isMobile ? 2 : 3, 
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'flex-start' : 'center', 
                mb: 2,
                gap: isMobile ? 1 : 0
              }}>
                <Typography variant={isMobile ? "h6" : "h5"} sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontSize: isMobile ? '1.1rem' : '1.5rem'
                }}>
                  <IconHistory size={isMobile ? 20 : 24} style={{ marginRight: '8px' }} />
                  Lịch sử xếp lịch thi
                </Typography>
                {processedResult && (
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size={isMobile ? "small" : "medium"}
                    startIcon={<IconDownload size={isMobile ? 16 : 18} />}
                    onClick={handleDownload}
                  >
                    Tải xuống
                  </Button>
                )}
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Box sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
                  <Typography>{error}</Typography>
                </Box>
              ) : processedResult ? (
                <>
                  <Box className="results-container">
                    <ExcelResultDisplay 
                      data={{
                        ...processedResult,
                        expandedItems: expandedItems,
                        toggleItemExpand: toggleItemExpand,
                        onRoomListClick: (rooms, subjectName) => {
                          setSelectedRooms(rooms);
                          setSelectedSubject(subjectName);
                          setShowRoomModal(true);
                        }
                      }}
                    />
                  </Box>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Stack spacing={2} sx={{ 
                      mt: 3, 
                      display: 'flex', 
                      alignItems: 'center' 
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        Trang {currentPage} / {totalPages} - Tổng cộng {fullData.length} bản ghi
                      </Typography>
                      <Pagination 
                        count={totalPages} 
                        page={currentPage} 
                        onChange={handlePageChange}
                        variant="outlined" 
                        color="primary"
                        size={isMobile ? "small" : "medium"}
                        showFirstButton={!isMobile}
                        showLastButton={!isMobile}
                        siblingCount={isMobile ? 0 : 1}
                      />
                    </Stack>
                  )}
                </>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography>Không có dữ liệu lịch thi</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
          {/* Footer */}
          <Grid item xs={12}>
            <Box 
              component="footer" 
              sx={{
                py: isMobile ? 2 : 4,
                mt: isMobile ? 2 : 4,
                textAlign: 'center',
                backgroundColor: (theme) => theme.palette.background.paper,
                boxShadow: 3,
                borderRadius: 2
              }}
            >
              <Container maxWidth="lg">
                <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
                  Trường Đại học Kiến trúc Hà Nội
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  P. Văn Quán, Hà Đông, Hà Nội
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Điện thoại: 024 3854 1616 | Email: info@hau.edu.vn
                </Typography>
                <Divider sx={{ my: isMobile ? 1 : 2 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }}>
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

export default History;