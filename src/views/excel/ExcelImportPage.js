import React, { useState } from 'react';
import { IconCloudUpload, IconDownload, IconAlertTriangle, IconCalendarTime } from '@tabler/icons-react';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import ExcelFileUploader from './ExcelFileUploader';
import ExcelResultDisplay from './ExcelResultDisplay';
import * as XLSX from 'xlsx';
import './import.css';
var header = "Xếp lịch thi";
// Dat's quote
// Hành xác cùng nghiên cứu khoa học cực chill
const ExcelImportPage = () => {
  // trạng thái cho các file đã upload - reordered
  const [file1, setFile1] = useState(null); // Now Exam Rooms
  const [file2, setFile2] = useState(null); // Now Subjects
  const [file3, setFile3] = useState(null); // Now Students
  
  // Processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState(null);
  const [error, setError] = useState(null);

  // Modal states
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');

  const validateExcelFile = (file) => {
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!validTypes.includes(file.type)) {
      return 'File không đúng định dạng Excel';
    }
    return null;
  };

  // Handle file upload for each input
  const handleFileChange = (fileNum, file) => {
    const error = validateExcelFile(file);
    if (error) {
      setError(error);
      return;
    }
    
    if (fileNum === 1) setFile1(file);
    else if (fileNum === 2) setFile2(file);
    else if (fileNum === 3) setFile3(file);
  };

  // Process files
  const handleProcessFiles = async () => {
    if (!file1 || !file2 || !file3) {
      setError("Chưa upload đủ 3 file Excel");
      return;
    }
    
    setError(null);
    setIsProcessing(true);
    
    try {
      // Step 1: Upload files to their respective endpoints - REORDERED
      const roomsFormData = new FormData();
      roomsFormData.append('file', file1); // Exam Rooms (first)
      
      const subjectsFormData = new FormData();
      subjectsFormData.append('file', file2); // Subjects (second)
      
      const studentsFormData = new FormData();
      studentsFormData.append('file', file3); // Students (last)
      
      // Upload all files - REORDERED API calls
      const responses = await Promise.all([
        fetch('http://172.20.10.2:8080/upload/exam-rooms', { // First call
          method: 'POST',
          body: roomsFormData
        }),
        fetch('http://172.20.10.2:8080/upload/subjects', { // Second call
          method: 'POST',
          body: subjectsFormData
        }),
        fetch('http://172.20.10.2:8080/upload/students', { // Third call
          method: 'POST',
          body: studentsFormData
        })
      ]);
      
      // Check if uploads were successful
      if (responses.some(response => !response.ok)) {
        console.log(responses);
        throw new Error('Lỗi khi tải lên file Excel');
      }
      
      // Step 2: Call the generate endpoint to process the data - UPDATED to include both dates
      const generateResponse = await fetch(`http://172.20.10.2:8080/generate?start=${startDate}&end=${endDate}`, {
        method: 'POST'
      });
      
      if (!generateResponse.ok) {
        throw new Error('Lỗi khi xử lý lịch thi');
      }
      
      // Get the generated exam schedule
      const examSchedules = await generateResponse.json();
      
      // Create a downloadable blob from the data
      const blob = new Blob([JSON.stringify(examSchedules, null, 2)], {
        type: 'application/json'
      });
      const downloadUrl = URL.createObjectURL(blob);
      
      // Format the result for display
      const formattedResult = {
        totalRecords: examSchedules.length,
        successCount: examSchedules.length,
        errorCount: 0,
        processedData: {
          headers: ['Môn học', 'Phòng thi', 'Ngày thi', 'Ca thi'],
          rows: examSchedules.map(schedule => [
            schedule.subject ? schedule.subject.tenMon : 'N/A',
            schedule.assignedRooms && schedule.assignedRooms.length > 0 ? 
              <button 
                className="room-list-button"
                onClick={() => {
                  setSelectedRooms(schedule.assignedRooms);
                  setSelectedSubject(schedule.subject.tenMon);
                  setShowRoomModal(true);
                }}
              >
                Xem danh sách phòng ({schedule.assignedRooms.length} phòng)
              </button> : 'N/A',
            formatDate(schedule.examDate),
            schedule.slot || 'N/A'
          ])
        },
        logs: [
          {
            message: `Đã xếp thành công ${examSchedules.length} lịch thi`,
            timestamp: new Date().toLocaleString('vi-VN'),
            type: 'info'
          }
        ],
        downloadUrl: downloadUrl,
        rawData: examSchedules
      };
      
      setProcessedResult(formattedResult);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Lỗi không xác định');
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to format date
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

  // Handle file download as Excel from API
  const handleDownload = () => {
    if (!processedResult || !processedResult.rawData) return;
  
    try {
      // Use the selected dates from the state
      const apiUrl = `http://172.20.10.2:8080/api/examschedules/export?start=${startDate}&end=${endDate}`;
      
      // Make the request
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error downloading Excel file');
          }
          return response.blob();
        })
        .then(blob => {
          // Create a download link
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = 'lich_thi.xls';
          
          // Append to the document and trigger download
          document.body.appendChild(a);
          a.click();
          
          // Cleanup
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        })
        .catch(err => {
          console.error('Download error:', err);
          setError('Lỗi khi tải xuống file Excel');
        });
    } catch (err) {
      console.error('Error:', err);
      setError('Lỗi khi tải xuống file Excel');
    }
  };

  // Add this state along with the existing startDate
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    // Default end date is 14 days after start date
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  });

  return (
    <PageContainer title="Tải lên file excel" description="Import and process Excel files">
       <div className="page-title-container">
        <h1 className="page-main-title">{header}</h1>
        <p className="page-subtitle">Tải lên các file Excel để hệ thống tự động xếp lịch thi</p>
      </div>
      <DashboardCard title="Tải lên file excel">
        <div className="excel-grid-container">
          {/* File Uploaders - REORDERED */}
          <div className="excel-grid-full">
            <div className="upload-container-centered">
              <div className="excel-grid-item">
                <ExcelFileUploader 
                  title="Danh sách phòng thi" 
                  description="Upload file Excel phòng thi trước"
                  onFileChange={(file) => handleFileChange(1, file)}
                  file={file1}
                />
              </div>
              
              <div className="excel-grid-item">
                <ExcelFileUploader 
                  title="Danh sách môn học"
                  description="Upload file Excel môn học"
                  onFileChange={(file) => handleFileChange(2, file)}
                  file={file2}
                />
              </div>
              
              <div className="excel-grid-item">
                <ExcelFileUploader 
                  title="Danh sách thí sinh"
                  description="Upload file Excel thí sinh"
                  onFileChange={(file) => handleFileChange(3, file)}
                  file={file3}
                />
              </div>
            </div>
          </div>
          
          {/* Clear separator */}
          <div className="excel-grid-full"></div>
          
          {/* Date Picker Container - UPDATED */}
          <div className="excel-grid-full">
            <div className="date-picker-container">
              <div className="date-picker-title">
                <IconCalendarTime size={20} style={{ marginRight: '8px' }} />
                <span>Thời gian kỳ thi</span>
              </div>
              <div className="date-inputs-wrapper">
                <div className="date-input-group">
                  <label htmlFor="startDate">Ngày bắt đầu kỳ thi:</label>
                  <input
                    id="startDate"
                    type="date"
                    className="date-input"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      // If end date is before new start date, update end date too
                      if (new Date(e.target.value) > new Date(endDate)) {
                        const newEndDate = new Date(e.target.value);
                        newEndDate.setDate(newEndDate.getDate() + 14);
                        setEndDate(newEndDate.toISOString().split('T')[0]);
                      }
                    }}
                  />
                </div>
                <div className="date-input-group">
                  <label htmlFor="endDate">Ngày kết thúc kỳ thi:</label>
                  <input
                    id="endDate"
                    type="date"
                    className="date-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Button Container */}
          <div className="excel-grid-full">
            <div className="button-container">
              <button 
                className="process-button"
                onClick={() => {
                  handleProcessFiles();
                }}
                disabled={isProcessing || !file1 || !file2 || !file3}
              >
                <IconCloudUpload size={18} style={{ marginRight: '8px' }} />
                {isProcessing ? 'Đang xử lý...' : 'Bắt đầu xếp lịch'}
              </button>
              
              <button 
                className="download-button"
                onClick={handleDownload}
                disabled={!processedResult || !processedResult.rawData}
              >
                <IconDownload size={18} style={{ marginRight: '8px' }} />
                Tải xuống Excel
              </button>
            </div>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="excel-grid-full">
              <div className="error-alert">
                <IconAlertTriangle size={20} style={{ marginRight: '8px' }} />
                {error}
              </div>
            </div>
          )}
          
          {/* Loading Indicator */}
          {isProcessing && (
            <div className="excel-grid-full loading-container">
              <div className="spinner"></div>
            </div>
          )}
          
          {/* Results Display */}
          {processedResult && (
            <div className="excel-grid-full results-container">
              <ExcelResultDisplay 
                data={{
                  ...processedResult,
                  onRoomListClick: (rooms, subjectName) => {
                    setSelectedRooms(rooms);
                    setSelectedSubject(subjectName);
                    setShowRoomModal(true);
                  }
                }} 
              />
            </div>
          )}
        </div>
      </DashboardCard>

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
                      <td>{room.tenPhong}</td>
                      <td>{room.quantity}</td>
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

export default ExcelImportPage;