import React, { useState } from 'react';
import { 
  IconCheck, 
  IconAlertTriangle, 
  IconClipboardList, 
  IconInfoCircle 
} from '@tabler/icons-react';
import './display.css';

const ExcelResultDisplay = ({ data }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  // Handler for tab change
  const handleTabChange = (tabIndex) => {
    setSelectedTab(tabIndex);
  };

  // If no data is provided
  if (!data) {
    return (
      <div className="info-alert">
        <IconInfoCircle size={20} style={{ marginRight: '8px' }} />
        No results to display. Please process files first.
      </div>
    );
  }

  return (
    <div className="result-paper">
      <h2 className="result-title">Kết quả</h2>
      
      <div className="divider"></div>
      
      {/* Processing summary */}
      <div className="summary-section">
        <h3 className="section-title">Summary</h3>
        
        <ul className="info-list">
          <li className="info-item">
            <div className="info-icon">
              <IconClipboardList size={20} color="#1e88e5" />
            </div>
            <div className="info-content">
              <span className="info-label">Tổng số bản ghi</span>
              <span className="info-value">{data.totalRecords || "N/A"}</span>
            </div>
          </li>
          
          <li className="info-item">
            <div className="info-icon">
              <IconCheck size={20} color="#4caf50" />
            </div>
            <div className="info-content">
              <span className="info-label">thành công</span>
              <span className="info-value">{data.successCount || "N/A"}</span>
            </div>
          </li>
          
          {data.errorCount > 0 && (
            <li className="info-item">
              <div className="info-icon">
                <IconAlertTriangle size={20} color="#f44336" />
              </div>
              <div className="info-content">
                <span className="info-label">Errors Encountered</span>
                <span className="info-value">{data.errorCount || "0"}</span>
              </div>
            </li>
          )}
        </ul>
      </div>
      
      <div className="divider"></div>
      
      {/* Tabs for different data views */}
      <div className="tabs-container">
        <div className="tabs-header">
          <button 
            className={`tab-button ${selectedTab === 0 ? 'active-tab' : ''}`}
            onClick={() => handleTabChange(0)}
          >
            Dữ liệu đã xử lý
          </button>
          
          {data.errorRecords && data.errorRecords.length > 0 && (
            <button 
              className={`tab-button ${selectedTab === 1 ? 'active-tab' : ''}`}
              onClick={() => handleTabChange(1)}
            >
              Error Records
            </button>
          )}
          
          <button 
            className={`tab-button ${selectedTab === 2 ? 'active-tab' : ''}`}
            onClick={() => handleTabChange(2)}
          >
            Danh sách coi thi
          </button>
        </div>
        
        {/* Processed Data Tab */}
        {selectedTab === 0 && data.processedData && (
          <div className="tab-content">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    {data.processedData.headers && 
                      data.processedData.headers.map((header, index) => (
                        <th key={index}>{header}</th>
                      ))
                    }
                  </tr>
                </thead>
                <tbody>
                  {data.processedData.rows && 
                    data.processedData.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
            <span className="table-caption">
              Showing {data.processedData.rows ? data.processedData.rows.length : 0} of {data.totalRecords} records
            </span>
          </div>
        )}
        
        {/* Error Records Tab */}
        {selectedTab === 1 && data.errorRecords && (
          <div className="tab-content">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Error Message</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {data.errorRecords.map((record, index) => (
                    <tr key={index}>
                      <td>{record.row || 'N/A'}</td>
                      <td>{record.error || 'Unknown error'}</td>
                      <td>{JSON.stringify(record.data)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Processing Log Tab */}
        {selectedTab === 2 && data.logs && (
          <div className="tab-content">
            <ul className="log-list">
              {data.logs.map((log, index) => (
                <li key={index} className="log-item">
                  <div className="log-icon">
                    <IconInfoCircle 
                      size={20} 
                      color={log.type === 'error' ? '#f44336' : '#1e88e5'} 
                    />
                  </div>
                  <div className="log-content">
                    <span className="log-message">{log.message}</span>
                    <span className="log-timestamp">{log.timestamp}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelResultDisplay;