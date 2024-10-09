import React, { useState } from 'react';

function App() {
    const [planJson, setPlanJson] = useState(null);
    const [planReg, setPlanReg] = useState(null);
    const [output, setOutput] = useState('');

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'planJson') {
            setPlanJson(files[0]);
        } else if (name === 'planReg') {
            setPlanReg(files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!planJson || !planReg) {
            alert("Please upload both files.");
            return;
        }

        const formData = new FormData();
        formData.append('planJson', planJson);
        formData.append('planReg', planReg);

        try {
            const response = await fetch('/evaluate', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setOutput(data.result); // Assuming your server responds with a JSON object with a 'result' property
        } catch (error) {
            console.error('Error during evaluation:', error);
            setOutput('Error occurred during evaluation. Check console for details.');
        }
    };

    return (
        <div style={styles.app}>
            <h1 style={styles.header}>OPA Eval Tool</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.fileInput}>
                    <input
                        type="file"
                        name="planJson"
                        accept=".json"
                        onChange={handleFileChange}
                        style={styles.inputFile}
                    />
                    <label style={styles.label} htmlFor="planJson">Upload Plan JSON</label>
                </div>
                <div style={styles.fileInput}>
                    <input
                        type="file"
                        name="planReg"
                        accept=".rego"
                        onChange={handleFileChange}
                        style={styles.inputFile}
                    />
                    <label style={styles.label} htmlFor="planReg">Upload Plan Rego</label>
                </div>
                <button type="submit" style={styles.runButton}>Run OPA Eval</button>
            </form>
            <div style={styles.outputBox}>
                <h2 style={styles.outputHeader}>Output</h2>
                <pre style={styles.outputText}>{output}</pre>
            </div>
        </div>
    );
}

const styles = {
    app: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f4f9',
        margin: '0',
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    header: {
        textAlign: 'center',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    fileInput: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputFile: {
        display: 'none',
    },
    label: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px',
        borderRadius: '4px',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'background-color 0.3s',
    },
    runButton: {
        padding: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    outputBox: {
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    },
    outputHeader: {
        margin: '0',
    },
    outputText: {
        background: '#f8f9fa',
        padding: '10px',
        borderRadius: '4px',
        overflowX: 'auto',
        whiteSpace: 'pre-wrap', // Allow line breaks in output
    },
};

export default App;

