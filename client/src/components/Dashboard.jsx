// -------------------- components/Dashboard.jsx --------------------
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Navbar from './Navbar';


function Dashboard() {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const fetchFiles = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/account', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFiles(res.data.files);
  };

  const handleUpload = async () => {
    if (!file) return;
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    await axios.post('http://localhost:5000/api/upload', formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchFiles();
  };

  const handleDelete = async (fileUrl) => {
  const token = localStorage.getItem('token');

  try {
    await axios.post(
      'http://localhost:5000/api/delete',
      { fileUrl },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchFiles();
  } catch (err) {
    alert('Error deleting file');
  }
};


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const renderFile = (filePath, index) => {
    const extension = filePath.split('.').pop().toLowerCase();
    const fullPath = filePath;
    const filename = filePath.split('/').pop();

    return (
      <div key={index} className="file-item">
        {['jpg', 'jpeg', 'png', 'gif'].includes(extension) ? (
          <img src={fullPath} alt={filename} />
        ) : extension === 'pdf' ? (
          <a href={fullPath} target="_blank" rel="noreferrer" className="file-link">
            📄
          </a>
        ) : (
          <a href={fullPath} target="_blank" rel="noreferrer" className="file-link">
            📁
          </a>
        )}

        <p className="file-name">{filename}</p>

        <button className="delete-btn" onClick={() => handleDelete(filePath)}>
          Delete
        </button>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <h2>Your Files</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <div className="buttons">
        <button onClick={handleUpload}>Upload</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="files-section">
        {files.length > 0 ? (
          files.map((file, index) => renderFile(file, index))
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
