const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Use memory storage
const upload = multer({ storage: storage });

// OpenAI API endpoint
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Endpoint to handle policy generation using OpenAI
app.post('/generate-policy', async (req, res) => {
    const { prompt } = req.body; // Get the prompt from the request body

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
    }

    try {
        const response = await axios.post(OPENAI_API_URL, {
            model: "gpt-3.5-turbo", // Use your desired model
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150 // Adjust based on your needs
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Send the response from OpenAI to the frontend
        res.json({ policy: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error generating policy:", error);
        res.status(500).json({ error: "Error generating policy." });
    }
});

// Endpoint to handle file upload and OPA eval
app.post('/evaluate', upload.fields([{ name: 'planJson' }, { name: 'planReg' }]), (req, res) => {
    const planJsonFile = req.files['planJson'][0]; // Access the plan.json file
    const planRegFile = req.files['planReg'][0];   // Access the plan.rego file

    // Create temporary files in a specific directory
    const planJsonPath = path.join(__dirname, planJsonFile.originalname);
    const planRegPath = path.join(__dirname, planRegFile.originalname);

    // Write the files to the filesystem
    fs.writeFileSync(planJsonPath, planJsonFile.buffer);
    fs.writeFileSync(planRegPath, planRegFile.buffer);

    // Prepare OPA eval command
    const command = `opa eval -i ${planJsonPath} -d ${planRegPath} "data.gcp.deny"`; // Adjust your policy path accordingly

    // Execute OPA eval
    exec(command, (error, stdout, stderr) => {
        // Cleanup temporary files
        fs.unlinkSync(planJsonPath);
        fs.unlinkSync(planRegPath);

        if (error) {
            console.error(`Error executing OPA eval: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }

        // Send the output to the frontend
        res.json({ output: stdout, error: stderr });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
