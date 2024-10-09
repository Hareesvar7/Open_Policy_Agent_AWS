// src/App.js

import React, { useEffect, useState } from 'react';

const App = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the repository contents from the GitHub API
  const fetchRepoContents = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/contents/Aws');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepoContents();
  }, []);

  // Inline CSS styles
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      margin: '20px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    fileList: {
      listStyleType: 'none',
      padding: '0',
    },
    fileItem: {
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      margin: '5px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
    },
    folder: {
      fontWeight: 'bold',
    },
    file: {
      color: '#333',
    },
    error: {
      color: 'red',
      textAlign: 'center',
    },
    loading: {
      textAlign: 'center',
    },
  };

  // Render loading, error, or file contents
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>GitHub Repository Contents</h1>
      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : error ? (
        <p style={styles.error}>Error: {error}</p>
      ) : (
        <ul style={styles.fileList}>
          {files.map((file) => (
            <li key={file.path} style={styles.fileItem}>
              <span style={file.type === 'dir' ? styles.folder : styles.file}>{file.name}</span>
              <a href={file.html_url} target="_blank" rel="noopener noreferrer">View</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;

