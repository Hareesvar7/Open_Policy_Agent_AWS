
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
        <div style={styles.container}>
            <h1>OPA Eval Tool</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    name="planJson"
                    accept=".json"
                    onChange={handleFileChange}
                />
                <input
                    type="file"
                    name="planReg"
                    accept=".rego"
                    onChange={handleFileChange}
                />
                <button type="submit">Run OPA Eval</button>
            </form>
            <div style={styles.outputBox}>
                <h2>Output</h2>
                <pre>{output}</pre>
            </div>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    outputBox: {
        marginTop: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#fff',
    },
};

export default App;
