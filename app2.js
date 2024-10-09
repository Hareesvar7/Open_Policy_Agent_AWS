// src/App.js

import React, { useState } from 'react';

const App = () => {
  const [planJson, setPlanJson] = useState(null);
  const [planRego, setPlanRego] = useState(null);
  const [message, setMessage] = useState('');

  // Inline CSS styles
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      margin: '50px auto',
      maxWidth: '600px',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: '24px',
    },
    input: {
      margin: '10px 0',
      padding: '10px',
      width: '100%',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    button: {
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      display: 'block',
      width: '100%',
      marginTop: '10px',
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
    message: {
      textAlign: 'center',
      color: 'green',
      marginTop: '20px',
    },
    error: {
      textAlign: 'center',
      color: 'red',
      marginTop: '20px',
    },
  };

  // Handle file change
  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  // Handle run button click
  const handleRunClick = () => {
    // Simulate running the policies here
    if (planJson && planRego) {
      // Placeholder for running logic
      setMessage('Running policies with the provided files...');
      setTimeout(() => {
        setMessage('Policies executed successfully!');
      }, 2000);
    } else {
      setMessage('Please upload both files before running.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Run OPA Policies</h1>
      <input
        type="file"
        accept=".json"
        onChange={(e) => handleFileChange(e, setPlanJson)}
        style={styles.input}
      />
      <input
        type="file"
        accept=".rego"
        onChange={(e) => handleFileChange(e, setPlanRego)}
        style={styles.input}
      />
      <button
        style={{ ...styles.button, ...(planJson && planRego ? {} : styles.buttonDisabled) }}
        onClick={handleRunClick}
        disabled={!planJson || !planRego}
      >
        Run
      </button>
      {message && (
        <div style={planJson && planRego ? styles.message : styles.error}>{message}</div>
      )}
    </div>
  );
};

export default App;
