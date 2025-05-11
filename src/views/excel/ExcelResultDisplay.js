import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Box, Chip, Card, CardContent, Button
} from '@mui/material';

const ExcelResultDisplay = ({ data }) => {
  // Extract the actual exam schedule data
  const scheduleData = data.rawData || [];
  
  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Kết quả xếp lịch thi ({scheduleData.length} lịch thi)
          </Typography>
          
          <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <Chip 
              label={`Tổng số: ${data.totalRecords}`} 
              color="primary" 
              variant="outlined" 
            />
            <Chip 
              label={`Thành công: ${data.successCount}`} 
              color="success" 
              variant="outlined"
            />
            {data.errorCount > 0 && (
              <Chip 
                label={`Lỗi: ${data.errorCount}`} 
                color="error" 
                variant="outlined"
              />
            )}
          </Box>
          
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.light' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>STT</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Môn học</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Phòng thi</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ngày thi</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ca thi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scheduleData.map((schedule, index) => (
                  <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {schedule.subject?.tenMon || "N/A"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Mã: {schedule.subject?.maMon || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {schedule.assignedRooms && schedule.assignedRooms.length > 0 ? (
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => {
                            // This will be handled by the parent component
                            if (data.onRoomListClick) {
                              data.onRoomListClick(schedule.assignedRooms, schedule.subject.tenMon);
                            }
                          }}
                        >
                          Xem danh sách phòng ({schedule.assignedRooms.length} phòng)
                        </Button>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>{formatDate(schedule.examDate)}</TableCell>
                    <TableCell>{schedule.slot || "N/A"}</TableCell>
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

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

export default ExcelResultDisplay;