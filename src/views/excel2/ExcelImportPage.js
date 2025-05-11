import React, { useState } from 'react';
import { IconCloudUpload, IconDownload, IconAlertTriangle, IconFolderOpen } from '@tabler/icons-react';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import ExcelFileUploader from './ExcelFileUploader';
import ExcelResultDisplay from './ExcelResultDisplay';
import './import2.css';
import * as XLSX from 'xlsx';
var header = "Xếp coi thi";
const ExcelImportPage = () => {
  // Only need one file upload for room list
  const [file1, setFile1] = useState(null);
  
  // Processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState(null);
  const [error, setError] = useState(null);

  const validateExcelFile = (file) => {
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!validTypes.includes(file.type)) {
      return 'File không đúng định dạng Excel';
    }
    return null;
  };

  // Handle file upload
  const handleFileChange = (fileNum, file) => {
    const error = validateExcelFile(file);
    if (error) {
      setError(error);
      return;
    }
    
    if (fileNum === 1) setFile1(file);
  };

  // Generate fake exam supervision data
  const generateFakeExamSupervision = () => {
    // Danh sách giám thị giả lập
    const teachers = [
      { id: 1, name: "Nguyễn Văn A", department: "Khoa Toán", position: "Giảng viên" },
      { id: 2, name: "Trần Thị B", department: "Khoa Vật lý", position: "Phó Khoa" },
      { id: 3, name: "Lê Văn C", department: "Khoa CNTT", position: "Trưởng Bộ môn" },
      { id: 4, name: "Phạm Thị D", department: "Khoa Kiến trúc", position: "Giảng viên" },
      { id: 5, name: "Hoàng Văn E", department: "Khoa Xây dựng", position: "Giảng viên" }
    ];
    
    // Danh sách phòng thi
    const rooms = [
      { id: 1, roomName: "Phòng A2-101" },
      { id: 2, roomName: "Phòng A2-203" },
      { id: 3, roomName: "Phòng B1-304" },
      { id: 4, roomName: "Phòng C3-105" },
      { id: 5, roomName: "Hội trường lớn" }
    ];
    
    // Danh sách môn thi
    const subjects = [
      { maMon: "MATH101", tenMon: "Toán cao cấp" },
      { maMon: "PHY102", tenMon: "Vật lý đại cương" },
      { maMon: "CHEM103", tenMon: "Hóa học cơ bản" },
      { maMon: "PROG104", tenMon: "Lập trình căn bản" },
      { maMon: "ENG105", tenMon: "Tiếng Anh chuyên ngành" }
    ];
    
    // Tạo lịch coi thi
    const supervisionSchedules = [];
    const startDate = new Date(2025, 5, 1); // 1/6/2025
    
    for (let i = 0; i < 15; i++) {
      const examDate = new Date(startDate);
      examDate.setDate(startDate.getDate() + Math.floor(i / 3)); // 3 ca thi mỗi ngày
      
      const mainTeacher = teachers[i % teachers.length];
      const secondTeacher = teachers[(i + 1) % teachers.length];
      
      supervisionSchedules.push({
        id: i + 1,
        examRoom: rooms[i % rooms.length],
        subject: subjects[i % subjects.length],
        examDate: examDate.toISOString(),
        examSlot: `Ca ${(i % 3) + 1} (${8 + (i % 3) * 3}:00 - ${10 + (i % 3) * 3}:00)`,
        mainSupervisor: mainTeacher,
        assistantSupervisor: secondTeacher
      });
    }
    
    // Tạo kết quả giả lập
    const blob = new Blob([JSON.stringify(supervisionSchedules, null, 2)], {
      type: 'application/json'
    });
    const downloadUrl = URL.createObjectURL(blob);
    
    return {
      totalRecords: supervisionSchedules.length,
      successCount: supervisionSchedules.length,
      errorCount: 0,
      processedData: {
        headers: ['Phòng thi', 'Môn thi', 'Ngày thi', 'Ca thi', 'Giám thị 1', 'Giám thị 2'],
        rows: supervisionSchedules.map(schedule => [
          schedule.examRoom.roomName,
          schedule.subject.tenMon,
          formatDate(schedule.examDate),
          schedule.examSlot,
          schedule.mainSupervisor.name,
          schedule.assistantSupervisor.name
        ])
      },
      logs: [
        {
          message: `Đã phân công ${supervisionSchedules.length} ca coi thi cho giảng viên`,
          timestamp: new Date().toLocaleString('vi-VN'),
          type: 'info'
        }
      ],
      downloadUrl: downloadUrl,
      rawData: supervisionSchedules
    };
  };

  // Process files - now just generates fake data
  const handleProcessFiles = async () => {
    if (!file1) {
      setError("Chưa upload danh sách phòng thi");
      return;
    }
    
    setError(null);
    setIsProcessing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate fake data
      const fakeResult = generateFakeExamSupervision();
      setProcessedResult(fakeResult);
    } catch (err) {
      setError(err.message || 'Lỗi không xác định');
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to format date in Vietnamese
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
      // Convert supervision data to worksheet format
      const worksheet = XLSX.utils.json_to_sheet(processedResult.rawData.map(schedule => ({
        'Phòng thi': schedule.examRoom.roomName,
        'Môn thi': schedule.subject.tenMon,
        'Mã môn': schedule.subject.maMon,
        'Ngày thi': formatDate(schedule.examDate),
        'Ca thi': schedule.examSlot,
        'Giám thị 1': schedule.mainSupervisor.name,
        'Bộ môn': schedule.mainSupervisor.department,
        'Giám thị 2': schedule.assistantSupervisor.name,
        'Bộ môn 2': schedule.assistantSupervisor.department
      })));
      
      // Set column widths for better readability
      const wscols = [
        {wch: 15}, // Phòng thi
        {wch: 20}, // Môn thi
        {wch: 10}, // Mã môn
        {wch: 25}, // Ngày thi
        {wch: 20}, // Ca thi
        {wch: 20}, // Giám thị 1
        {wch: 15}, // Bộ môn
        {wch: 20}, // Giám thị 2
        {wch: 15}  // Bộ môn 2
      ];
      worksheet['!cols'] = wscols;
      
      // Create workbook and add the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Lịch coi thi');
      
      // Generate Excel file
      XLSX.writeFile(workbook, 'lich_coi_thi.xlsx');
    } catch (err) {
      console.error('Error generating Excel:', err);
      setError('Lỗi khi tạo file Excel');
    }
  };

  return (
    <PageContainer title="Xếp lịch coi thi" description="Phân công giảng viên coi thi">
      {/* dat wrote this code bro */}
      <div className="page-title-container">
        <h1 className="page-main-title">{header}</h1>
        <p className="page-subtitle">Tải lên các file Excel để hệ thống tự động xếp lịch thi</p>
      </div>
      <DashboardCard title="Lịch coi thi giảng viên">
        <div className="excel-grid-container">
          {/* Centered File Uploader with clear File Explorer button */}
          <div className="excel-grid-full">
            <div className="centered-upload-container">
              <div className="centered-excel-uploader">
                <ExcelFileUploader 
                  title="Danh sách phòng thi" 
                  description="Upload danh sách phòng thi để xếp lịch coi thi"
                  onFileChange={(file) => handleFileChange(1, file)}
                  file={file1}
                  showFileExplorerButton={true}
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="excel-grid-full">
            <div className="button-container">
              <button 
                className="process-button"
                onClick={handleProcessFiles}
                disabled={isProcessing || !file1}
              >
                <IconCloudUpload size={18} style={{ marginRight: '8px' }} />
                {isProcessing ? 'Đang xử lý...' : 'Phân công giám thị'}
              </button>
              
              <button 
                className="download-button"
                onClick={handleDownload}
                disabled={!processedResult || !processedResult.rawData}
              >
                <IconDownload size={18} style={{ marginRight: '8px' }} />
                Tải xuống file Excel
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
              <ExcelResultDisplay data={processedResult} />
            </div>
          )}
        </div>
      </DashboardCard>
    </PageContainer>
  );
};

export default ExcelImportPage;