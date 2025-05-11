import React, { useRef } from 'react';
import { IconCloudUpload, IconFile, IconFolderOpen } from '@tabler/icons-react';
import './upload.css'; // Add this CSS file for styles

const ExcelFileUploader = ({ title, description, onFileChange, file }) => {
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  const openFileExplorer = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="excel-file-uploader">
      <h3 style={{ marginTop: 0, marginBottom: '8px' }}>{title}</h3>
      <p style={{ marginTop: 0, color: '#666' }}>{description}</p>

      {file ? (
        <div className="file-selected">
          <IconFile size={24} />
          <span style={{ marginLeft: '8px', flex: 1 }}>{file.name}</span>
          <button
            style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer' }}
            onClick={openFileExplorer}
          >
            Thay đổi
          </button>
        </div>
      ) : (
        <div
          style={{
            border: '2px dashed #ccc',
            borderRadius: '4px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div style={{ marginBottom: '12px' }}>
            <IconCloudUpload size={48} color="#999" />
          </div>
          <p style={{ margin: '0 0 12px 0' }}>Kéo & thả file hoặc</p>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              margin: '0 auto',
            }}
            onClick={openFileExplorer}
          >
            <IconFolderOpen size={18} style={{ marginRight: '8px' }} />
            Chọn từ File Explorer
          </button>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
        accept=".xlsx,.xls"
      />
    </div>
  );
};

export default ExcelFileUploader;