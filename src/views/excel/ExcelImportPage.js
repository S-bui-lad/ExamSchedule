import React, { useState } from 'react';
import { IconCloudUpload, IconDownload, IconAlertTriangle } from '@tabler/icons-react';
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
        fetch('http://localhost:8080/upload/exam-rooms', { // First call
          method: 'POST',
          body: roomsFormData
        }),
        fetch('http://localhost:8080/upload/subjects', { // Second call
          method: 'POST',
          body: subjectsFormData
        }),
        fetch('http://localhost:8080/upload/students', { // Third call
          method: 'POST',
          body: studentsFormData
        })
      ]);
      
      // Check if uploads were successful
      if (responses.some(response => !response.ok)) {
        console.log(responses);
        throw new Error('Lỗi khi tải lên file Excel');
      }
      
      // Step 2: Call the generate endpoint to process the data
      const generateResponse = await fetch('http://localhost:8080/generate?start=2025-05-11&end=2025-05-25', {
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

  // Handle file download as Excel
  const handleDownload = () => {
    if (!processedResult || !processedResult.rawData) return;

    try {
      // Convert data to worksheet format
      const worksheet = XLSX.utils.json_to_sheet(processedResult.rawData.map(schedule => ({
        'Môn học': schedule.subject ? schedule.subject.tenMon : 'N/A',
        'Mã môn': schedule.subject ? schedule.subject.maMon : 'N/A',
        'Phòng thi': schedule.assignedRooms && schedule.assignedRooms.length > 0 ? 
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
        'Ngày thi': formatDate(schedule.examDate),
        'Ca thi': schedule.examSlot || 'N/A'
      })));
      
      // Create workbook and add the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Lịch thi');
      
      // Generate Excel file
      XLSX.writeFile(workbook, 'lich_thi.xlsx');
    } catch (err) {
      console.error('Error generating Excel:', err);
      setError('Lỗi khi tạo file Excel');
    }
  };

  // Add this function to your ExcelImportPage.js file
  const generateFakeResults = () => {
    // Danh sách fake môn học
    const subjects = [
      { maMon: "MATH101", tenMon: "Toán cao cấp" },
      { maMon: "PHY102", tenMon: "Vật lý đại cương" },
      { maMon: "CHEM103", tenMon: "Hóa học cơ bản" },
      { maMon: "PROG104", tenMon: "Lập trình căn bản" },
      { maMon: "ENG105", tenMon: "Tiếng Anh chuyên ngành" },
      { maMon: "ARCH106", tenMon: "Mỹ thuật kiến trúc" },
      { maMon: "HIST107", tenMon: "Lịch sử kiến trúc" },
      { maMon: "CIVIL108", tenMon: "Cơ học kết cấu" }
    ];
    
    // Danh sách fake phòng thi
    const rooms = [
      { id: 1, roomName: "Phòng A2-101" },
      { id: 2, roomName: "Phòng A2-203" },
      { id: 3, roomName: "Phòng B1-304" },
      { id: 4, roomName: "Phòng C3-105" },
      { id: 5, roomName: "Hội trường lớn" }
    ];
    
    // Tạo giả lập lịch thi
    const fakeSchedules = [];
    const startDate = new Date(2025, 5, 1); // 1/6/2025
    
    // Tạo 20 lịch thi giả lập
    for (let i = 0; i < 20; i++) {
      const examDate = new Date(startDate);
      examDate.setDate(startDate.getDate() + Math.floor(i / 4)); // Mỗi ngày có 4 ca thi
      
      fakeSchedules.push({
        id: i + 1,
        subject: subjects[i % subjects.length],
        examRoom: rooms[i % rooms.length],
        examDate: examDate.toISOString(),
        examSlot: `Ca ${(i % 4) + 1} (${7 + (i % 4) * 3}:30 - ${9 + (i % 4) * 3}:30)`
      });
    }
    
    // Tạo kết quả giả lập
    const blob = new Blob([JSON.stringify(fakeSchedules, null, 2)], {
      type: 'application/json'
    });
    const downloadUrl = URL.createObjectURL(blob);
    
    return {
      totalRecords: fakeSchedules.length,
      successCount: fakeSchedules.length,
      errorCount: 0,
      processedData: {
        headers: ['Môn học', 'Phòng thi', 'Ngày thi', 'Ca thi'],
        rows: fakeSchedules.map(schedule => [
          schedule.subject ? schedule.subject.tenMon : 'N/A',
          schedule.examRoom ? schedule.examRoom.roomName : 'N/A',
          formatDate(schedule.examDate),
          schedule.examSlot || 'N/A'
        ])
      },
      logs: [
        {
          message: `Đã xếp thành công ${fakeSchedules.length} lịch thi`,
          timestamp: new Date().toLocaleString('vi-VN'),
          type: 'info'
        }
      ],
      downloadUrl: downloadUrl,
      rawData: fakeSchedules
    };
  };

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
                onClick={() => {
                  if (processedResult && processedResult.rawData) {
                    try {
                      // Convert data to worksheet format
                      const worksheet = XLSX.utils.json_to_sheet(processedResult.rawData.map(schedule => ({
                        'Môn học': schedule.subject ? schedule.subject.tenMon : 'N/A',
                        'Mã môn': schedule.subject ? schedule.subject.maMon : 'N/A',
                        'Phòng thi': schedule.assignedRooms && schedule.assignedRooms.length > 0 ? 
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
                        'Ngày thi': formatDate(schedule.examDate),
                        'Ca thi': schedule.examSlot || 'N/A'
                      })));
                      
                      // Create workbook and add the worksheet
                      const workbook = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(workbook, worksheet, 'Lịch thi');
                      
                      // Generate Excel file
                      XLSX.writeFile(workbook, 'lich_thi.xlsx');
                    } catch (err) {
                      console.error('Error generating Excel:', err);
                      setError('Lỗi khi tạo file Excel');
                    }
                  }
                }}
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