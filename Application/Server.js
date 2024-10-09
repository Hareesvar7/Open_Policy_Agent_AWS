const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors());  // Allow cross-origin requests

// Endpoint to handle file upload and OPA eval
app.post('/evaluate', upload.fields([{ name: 'planJson' }, { name: 'planReg' }]), (req, res) => {
    const planJsonFile = req.files['planJson'][0];
    const planRegFile = req.files['planReg'][0];
    const policyPath = req.body.policyPath;  // Get policy path from the frontend request

    const planJsonPath = path.join(__dirname, planJsonFile.originalname);
    const planRegPath = path.join(__dirname, planRegFile.originalname);

    // Write the files to the filesystem
    fs.writeFileSync(planJsonPath, planJsonFile.buffer);
    fs.writeFileSync(planRegPath, planRegFile.buffer);

    // Prepare OPA eval command dynamically with user-provided policy path
    const command = `opa eval -i ${planJsonPath} -d ${planRegPath} "${policyPath}"`;

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
