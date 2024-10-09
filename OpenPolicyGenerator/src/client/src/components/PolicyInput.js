import React, { useState } from 'react';
import axios from 'axios';

const PolicyInput = () => {
    const [planJson, setPlanJson] = useState(null);
    const [policyReg, setPolicyReg] = useState(null);
    const [output, setOutput] = useState("");

    const handleFileChange = (event, setFile) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('planJson', planJson);
        formData.append('planReg', policyReg);

        try {
            const response = await axios.post('http://localhost:5000/evaluate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setOutput(response.data.output);
        } catch (error) {
            setOutput(`Error: ${error.message}`);
        }
    };

    return (
        <div className="input-container">
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept=".json"
                    onChange={(e) => handleFileChange(e, setPlanJson)}
                    required
                />
                <input
                    type="file"
                    accept=".rego"
                    onChange={(e) => handleFileChange(e, setPolicyReg)}
                    required
                />
                <button type="submit">Run</button>
            </form>
            <div className="output-container">
                <h2>Output:</h2>
                <pre>{output}</pre>
            </div>
        </div>
    );
};

export default PolicyInput;
