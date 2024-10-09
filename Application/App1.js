import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [planJsonFile, setPlanJsonFile] = useState(null);
    const [planRegFile, setPlanRegFile] = useState(null);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    // Inline CSS styles
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            width: '400px',
            margin: '0 auto',
            boxShadow: '2px 2px 12px rgba(0,0,0,0.1)',
            backgroundColor: '#f9f9f9'
        },
        input: {
            margin: '10px 0',
            padding: '10px',
            width: '100%',
            borderRadius: '4px',
            border: '1px solid #ccc',
        },
        button: {
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '10px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
            marginTop: '10px',
        },
        outputBox: {
            marginTop: '20px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '100%',
            height: '200px',
            overflowY: 'auto',
            backgroundColor: '#fff',
        },
        error: {
            color: 'red',
            marginTop: '10px',
        }
    };

    const handleFileChange = (event, setter) => {
        const file = event.target.files[0];
        if (file) {
            const fileExtension = file.name.split('.').pop();
            if (setter === setPlanJsonFile && fileExtension !== 'json') {
                setError('Please upload a valid JSON file.');
                return;
            }
            if (setter === setPlanRegFile && fileExtension !== 'rego') {
                setError('Please upload a valid REGO file.');
                return;
            }
            setError('');
            setter(file);
        }
    };

    const handleSubmit = async () => {
        if (!planJsonFile || !planRegFile) {
            setError('Please upload both files.');
            return;
        }

        const formData = new FormData();
        formData.append('planJson', planJsonFile);
        formData.append('planReg', planRegFile);

        try {
            const response = await axios.post('http://localhost:5000/evaluate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setOutput(response.data.output);
        } catch (err) {
            setOutput('');
            setError('Error evaluating policy: ' + err.response.data.error);
        }
    };

    return (
        <div style={styles.container}>
            <h2>OPA Policy Evaluator</h2>
            <input
                type="file"
                accept=".json"
                onChange={(event) => handleFileChange(event, setPlanJsonFile)}
                style={styles.input}
            />
            <input
                type="file"
                accept=".rego"
                onChange={(event) => handleFileChange(event, setPlanRegFile)}
                style={styles.input}
            />
            <button onClick={handleSubmit} style={styles.button}>Run OPA Eval</button>
            {error && <div style={styles.error}>{error}</div>}
            <div style={styles.outputBox}>
                <pre>{output}</pre>
            </div>
        </div>
    );
};

export default App;
