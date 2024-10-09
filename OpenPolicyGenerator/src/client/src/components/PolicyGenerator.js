import React, { useState } from 'react';
import axios from 'axios';
import OutputDisplay from './OutputDisplay';

const PolicyGenerator = () => {
    const [planFile, setPlanFile] = useState(null);
    const [policyFile, setPolicyFile] = useState(null);
    const [output, setOutput] = useState('');

    const handlePlanChange = (event) => {
        setPlanFile(event.target.files[0]);
    };

    const handlePolicyChange = (event) => {
        setPolicyFile(event.target.files[0]);
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
        } catch (error) {
            console.error("There was an error!", error);
            setOutput("Error evaluating policy.");
        }
    };

    return (
        <div className="policy-generator">
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".json" onChange={handlePlanChange} required />
                <input type="file" accept=".rego" onChange={handlePolicyChange} required />
                <button type="submit">Run</button>
            </form>
            <OutputDisplay output={output} />
        </div>
    );
};

export default PolicyGenerator;

