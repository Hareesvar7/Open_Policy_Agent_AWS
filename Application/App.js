import React, { useState } from 'react';

function App() {
  const [output, setOutput] = useState('');

  const handleRunOpaEval = async () => {
    try {
      const response = await fetch('http://localhost:4000/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      console.error('Error running OPA eval:', error);
      setOutput('Error running OPA eval');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>OPA Eval Runner</h1>
      <button
        onClick={handleRunOpaEval}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '15px 32px',
          textAlign: 'center',
          textDecoration: 'none',
          display: 'inline-block',
          fontSize: '16px',
          margin: '10px',
          cursor: 'pointer',
          border: 'none',
        }}
      >
        Run OPA Eval
      </button>

      <div style={{
        marginTop: '20px',
        border: '1px solid #ccc',
        padding: '10px',
        width: '80%',
        margin: 'auto',
        textAlign: 'left',
        whiteSpace: 'pre-wrap',
        backgroundColor: '#f9f9f9',
      }}>
        <h3>OPA Eval Output:</h3>
        {output ? <pre>{output}</pre> : <p>No output yet.</p>}
      </div>
    </div>
  );
}

export default App;
