import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [planFile, setPlanFile] = useState(null);
    const [policyFile, setPolicyFile] = useState(null);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [prompt, setPrompt] = useState('');
    const [aiOutput, setAiOutput] = useState('');
    const [policies, setPolicies] = useState([]);

    // Fetch policies from GitHub
    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const response = await axios.get('http://localhost:5000/fetch-policies'); // Adjust the URL as needed
                setPolicies(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPolicies();
    }, []);

    const handlePlanChange = (event) => {
        setPlanFile(event.target.files[0]);
    };

    const handlePolicyChange = (event) => {
        setPolicyFile(event.target.files[0]);
    };

    const handlePromptChange = (event) => {
        setPrompt(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('planJson', planFile);
        formData.append('policyReg', policyFile);

        try {
            const response = await axios.post('http://localhost:5000/evaluate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setOutput(response.data.output);
            setError('');
        } catch (error) {
            console.error("There was an error!", error);
            setError("Error evaluating policy.");
            setOutput('');
        }
    };

    const handleAiPrompt = async () => {
        try {
            const response = await axios.post('http://localhost:5000/generate-policy', { prompt });
            setAiOutput(response.data.policy);
            setError('');
        } catch (error) {
            console.error("There was an error generating the policy!", error);
            setError("Error generating policy from AI.");
            setAiOutput('');
        }
    };

    return (
        <div style={styles.app}>
            <h1 style={styles.header}>OPA Policy Generator</h1>
            <div style={styles.container}>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="file"
                        accept=".json"
                        onChange={handlePlanChange}
                        required
                        style={styles.input}
                    />
                    <input
                        type="file"
                        accept=".rego"
                        onChange={handlePolicyChange}
                        required
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button}>Run Evaluation</button>
                </form>

                <div style={styles.outputContainer}>
                    <h2>Output:</h2>
                    {error && <p style={styles.error}>{error}</p>}
                    <textarea
                        value={output}
                        readOnly
                        style={styles.textarea}
                    />
                </div>

                <div style={styles.promptContainer}>
                    <h2>Generate Policy with AI</h2>
                    <input
                        type="text"
                        value={prompt}
                        onChange={handlePromptChange}
                        placeholder="Enter your prompt here..."
                        style={styles.promptInput}
                    />
                    <button onClick={handleAiPrompt} style={styles.button}>Generate Policy</button>
                    <div style={styles.aiOutputContainer}>
                        <h2>AI Generated Policy:</h2>
                        <textarea
                            value={aiOutput}
                            readOnly
                            style={styles.textarea}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    app: {
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        marginBottom: '20px',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '20px',
    },
    input: {
        margin: '10px',
        padding: '10px',
        width: '300px',
    },
    button: {
        padding: '10px 20px',
        marginTop: '10px',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    outputContainer: {
        margin: '20px 0',
        width: '80%',
        maxWidth: '600px',
    },
    textarea: {
        width: '100%',
        height: '200px',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        resize: 'none',
    },
    promptContainer: {
        marginTop: '30px',
    },
    promptInput: {
        width: '400px',
        padding: '10px',
        margin: '10px 0',
        fontSize: '16px',
    },
    aiOutputContainer: {
        marginTop: '20px',
    },
    error: {
        color: 'red',
    },
};

export default App;
