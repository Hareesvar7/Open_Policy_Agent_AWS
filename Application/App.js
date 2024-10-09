import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [planJsonFile, setPlanJsonFile] = useState(null);
    const [planRegFile, setPlanRegFile] = useState(null);
    const [policyPath, setPolicyPath] = useState('data.gcp.deny');  // Default policy path
    const [output, setOutput] = useState('');

    const handlePlanJsonChange = (e) => {
        setPlanJsonFile(e.target.files[0]);
    };

    const handlePlanRegChange = (e) => {
        setPlanRegFile(e.target.files[0]);
    };

    const handlePolicyPathChange = (e) => {
        setPolicyPath(e.target.value);
    };

    const handleRun = () => {
        const formData = new FormData();
        formData.append('planJson', planJsonFile);
        formData.append('planReg', planRegFile);
        formData.append('policyPath', policyPath);  // Pass the policy path dynamically

        axios.post('http://localhost:5000/evaluate', formData)
            .then(response => {
                setOutput(response.data.output);
            })
            .catch(error => {
                setOutput(`Error: ${error.message}`);
            });
    };

    return (
        <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>OPA Evaluation Tool</h2>

            <div style={{ marginBottom: '10px' }}>
                <label>Plan JSON: </label>
                <input type="file" onChange={handlePlanJsonChange} />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>Plan Rego: </label>
                <input type="file" onChange={handlePlanRegChange} />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>Policy Path: </label>
                <input
                    type="text"
                    value={policyPath}
                    onChange={handlePolicyPathChange}
                    placeholder="e.g., data.gcp.deny"
                    style={{ padding: '5px', width: '300px' }}
                />
            </div>

            <button onClick={handleRun} style={{
                padding: '10px 20px', 
                backgroundColor: '#4CAF50', 
                color: 'white', 
                border: 'none', 
                cursor: 'pointer'
            }}>
                Run
            </button>

            <h3>Output</h3>
            <textarea
                value={output}
                readOnly
                rows="10"
                style={{ width: '100%', padding: '10px', marginTop: '10px' }}
            />
        </div>
    );
}

export default App;
