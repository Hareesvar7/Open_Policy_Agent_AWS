import React, { useState } from 'react';

function App() {
  const [planFile, setPlanFile] = useState(null);
  const [regoFile, setRegoFile] = useState(null);
  const [output, setOutput] = useState('');

  const handlePlanFileChange = (event) => {
    setPlanFile(event.target.files[0]);
  };

  const handleRegoFileChange = (event) => {
    setRegoFile(event.target.files[0]);
  };

  const handleRun = async () => {
    const formData = new FormData();
    formData.append('planJson', planFile);
    formData.append('policyRego', regoFile);

    const response = await fetch('http://localhost:4000/evaluate', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setOutput(data.output);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>OPA Eval Runner</h1>
      <input type="file" onChange={handlePlanFileChange} />
      <input type="file" onChange={handleRegoFileChange} />
      <button onClick={handleRun} style={{ marginLeft: '10px' }}>
        Run OPA Eval
      </button>
      <h2>Output:</h2>
      <pre style={{ backgroundColor: '#f4f4f4', padding: '10px' }}>{output}</pre>
    </div>
  );
}

export default App;
