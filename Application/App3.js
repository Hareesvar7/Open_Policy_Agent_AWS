import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [planJson, setPlanJson] = useState(null);
    const [planReg, setPlanReg] = useState(null);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const { name, files } = event.target;
        if (name === 'planJson') {
            setPlanJson(files[0]);
        } else if (name === 'planReg') {
            setPlanReg(files[0]);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!planJson || !planReg) {
            setError('Both files are required');
            return;
        }

        const formData = new FormData();
        formData.append('planJson', planJson);
        formData.append('planReg', planReg);

        try {
            const response = await axios.post('http://localhost:5000/evaluate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setOutput(response.data.output);
            setError('');
        } catch (err) {
            setError(err.response.data.error || 'An error occurred');
            setOutput('');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>OPA Evaluation</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="file"
                        name="planJson"
                        accept=".json"
                        onChange={handleFileChange}
                        style={{ marginRight: '10px' }}
                    />
                    <input
                        type="file"
                        name="planReg"
                        accept=".rego"
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    Run OPA Eval
                </button>
            </form>
            {output && (
                <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
                    <h3>Output:</h3>
                    <pre>{output}</pre>
                </div>
            )}
            {error && (
                <div style={{ marginTop: '20px', color: 'red' }}>
                    <h3>Error:</h3>
                    <pre>{error}</pre>
                </div>
            )}
        </div>
    );
};

export default App;
