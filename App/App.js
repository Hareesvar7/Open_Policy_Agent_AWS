import React, { useState } from 'react';

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
      const response = await fetch('/evaluate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Error: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      setOutput(data.output || 'No output from OPA.');
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>OPA Eval Tool</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="file"
          name="planJson"
          accept=".json"
          onChange={handleFileChange}
          style={styles.fileInput}
        />
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
    backgroundColor: '#f4f4f4',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  fileInput: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  outputBox: {
    marginTop: '20px',
    width: '100%',
    maxWidth: '600px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#fff',
  },
  outputHeader: {
    fontSize: '18px',
  },
  output: {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
};

export default App;
