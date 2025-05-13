import React, { useRef } from 'react';
import { IconCloudUpload, IconFile, IconFolderOpen } from '@tabler/icons-react';
import './upload.css';

const ExcelFileUploader = ({ title, description, onFileChange, file, showFileExplorerButton = true }) => {
  const fileInputRef = useRef(null);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };
  
  // Function to open file explorer
  const openFileExplorer = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className="excel-file-uploader mobile-friendly">
      <h3>{title}</h3>
      <p>{description}</p>
      
      {file ? (
        <div className="file-selected">
          <IconFile size={20} />
          <span className="file-name">{file.name}</span>
          <button 
            className="change-button"
            onClick={openFileExplorer}
          >
            Thay đổi
          </button>
        </div>
      ) : (
        <div 
          className="drop-area"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileExplorer} // Make entire area clickable on mobile
        >
          <IconCloudUpload size={48} color="#9e9e9e" />
          <p>Nhấn để chọn file Excel</p>
          
          {showFileExplorerButton && (
            <button 
              className="file-explorer-button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent double clicks
                openFileExplorer();
              }}
            >
              <IconFolderOpen size={18} style={{ marginRight: '8px' }} />
              Chọn từ File Explorer
            </button>
          )}
        </div>
      )}
      
      {/* Hidden file input */}
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