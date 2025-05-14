import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Box, Chip, Card, CardContent, Button,
  useMediaQuery, useTheme
} from '@mui/material';

const ExcelResultDisplay = ({ data }) => {
  // Extract the actual exam schedule data
  const scheduleData = data.rawData || [];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box>
      <Card>
        <CardContent sx={{ p: isMobile ? 1 : 2 }}>
          <Typography variant="h6" gutterBottom>
            Kết quả xếp lịch thi ({scheduleData.length} lịch thi)
          </Typography>
          
          <Box sx={{ 
            mb: 2, 
            display: 'flex', 
            gap: 1, 
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-start'
          }}>
            <Chip 
              label={`Tổng số: ${data.totalRecords}`} 
              color="primary" 
              variant="outlined" 
              size={isMobile ? "small" : "medium"}
            />
            <Chip 
              label={`Thành công: ${data.successCount}`} 
              color="success" 
              variant="outlined"
              size={isMobile ? "small" : "medium"}
            />
            {data.errorCount > 0 && (
              <Chip 
                label={`Lỗi: ${data.errorCount}`} 
                color="error" 
                variant="outlined"
                size={isMobile ? "small" : "medium"}
              />
            )}
          </Box>
          
          <TableContainer 
            component={Paper} 
            sx={{ 
              overflowX: 'auto',
              '&::-webkit-scrollbar': { height: '8px' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#bdbdbd', borderRadius: '4px' }
            }}
          >
            <Table sx={{ minWidth: isMobile ? 400 : 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.light' }}>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    padding: isMobile ? '8px 6px' : '16px'
                  }}>STT</TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    padding: isMobile ? '8px 6px' : '16px'
                  }}>Môn học</TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    padding: isMobile ? '8px 6px' : '16px'
                  }}>Phòng thi</TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    padding: isMobile ? '8px 6px' : '16px'
                  }}>Ngày thi</TableCell>
                  <TableCell sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    padding: isMobile ? '8px 6px' : '16px'
                  }}>Ca thi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scheduleData.map((schedule, index) => (
                  <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}>
                    <TableCell sx={{ padding: isMobile ? '8px 6px' : '16px' }}>{index + 1}</TableCell>
                    <TableCell sx={{ padding: isMobile ? '8px 6px' : '16px' }}>
                      <Typography variant={isMobile ? "caption" : "body2"} fontWeight="medium">
                        {schedule.subject?.tenMon || "N/A"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Mã: {schedule.subject?.maMon || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ padding: isMobile ? '8px 6px' : '16px' }}>
                      {schedule.assignedRooms && schedule.assignedRooms.length > 0 ? (
                        <Button
                          variant="text"
                          color="primary"
                          size={isMobile ? "small" : "medium"}
                          sx={{ p: isMobile ? '2px 4px' : '6px 8px' }}
                          onClick={() => {
                            // This will be handled by the parent component
                            if (data.onRoomListClick) {
                              data.onRoomListClick(schedule.assignedRooms, schedule.subject.tenMon);
                            }
                          }}
                        >
                          Xem ({schedule.assignedRooms.length})
                        </Button>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell sx={{ 
                      padding: isMobile ? '8px 6px' : '16px',
                      fontSize: isMobile ? '0.75rem' : 'inherit'
                    }}>{formatDate(schedule.examDate, isMobile)}</TableCell>
                    <TableCell sx={{ 
                      padding: isMobile ? '8px 6px' : '16px',
                      fontSize: isMobile ? '0.75rem' : 'inherit'
                    }}>{schedule.slot || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

function formatDate(dateString, isMobile) {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: isMobile ? 'short' : 'long', 
      year: 'numeric', 
      month: isMobile ? 'numeric' : 'long', 
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

export default ExcelResultDisplay;