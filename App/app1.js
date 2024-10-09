import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [planJson, setPlanJson] = useState(null);
  const [planReg, setPlanReg] = useState(null);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const fileType = event.target.name;
    if (fileType === 'planJson') {
      setPlanJson(event.target.files[0]);
    } else if (fileType === 'planReg') {
      setPlanReg(event.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!planJson || !planReg) {
      setError('Both files are required.');
      return;
    }

    setError('');
    setOutput('');

    const formData = new FormData();
    formData.append('planJson', planJson);
    formData.append('planReg', planReg);

    try {
      const response = await axios.post('http://localhost:5000/evaluate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setOutput(response.data.output || 'No output from OPA.');
      if (response.data.error) {
        setError(`Error: ${response.data.error}`);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>OPA Policy Evaluation</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Upload plan.json:</label>
        <input
          type="file"
          name="planJson"
          accept=".json"
          onChange={handleFileChange}
          style={styles.fileInput}
        />
        <label style={styles.label}>Upload policy.rego:</label>
        <input
          type="file"
          name="planReg"
          accept=".rego"
          onChange={handleFileChange}
          style={styles.fileInput}
        />
        <button type="submit" style={styles.button}>Run OPA Eval</button>
      </form>
      {error && <div style={styles.error}>{error}</div>}
      <div style={styles.outputBox}>
        <h2 style={styles.outputHeader}>Output:</h2>
        <pre style={styles.output}>{output}</pre>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7f9fc',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px',
    width: '300px',
  },
  label: {
    fontSize: '16px',
    marginBottom: '5px',
    color: '#
