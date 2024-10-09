// src/App.js

import React, { useState } from 'react';

const App = () => {
  const [planJson, setPlanJson] = useState(null);
  const [planRego, setPlanRego] = useState(null);
  const [message, setMessage] = useState('');
  const [output, setOutput] = useState('');

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
    outputBox: {
      marginTop: '20px',
      padding: '10px',
      width: '100%',
      minHeight: '150px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: '#f1f1f1',
      whiteSpace: 'pre-wrap',
      fontFamily: 'monospace',
    },
  };

  // Handle file change
  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  // Convert the uploaded file to base64 for sending to the backend
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle the "Run" button click
  const handleRunClick = async () => {
    if (planJson && planRego) {
      setMessage('Running OPA evaluation...');

      try {
        const planJsonBase64 = await fileToBase64(planJson);
        const planRegoBase64 = await fileToBase64(planRego);

        const response = await fetch('http://localhost:4000/evaluate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planJson: planJsonBase64,
            planRego: planRegoBase64,
          }),
        });

        const result = await response.json();
        setMessage('OPA evaluation completed.');
        setOutput(result.output);
      } catch (error) {
        setMessage('Error occurred during OPA evaluation.');
        console.error(error);
      }
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
      <div style={styles.outputBox}>
        {output || 'Output will be displayed here after running the policies.'}
      </div>
    </div>
  );
};

export default App;
