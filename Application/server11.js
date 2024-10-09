const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const app = express();

// Configure Multer for temporary file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define the upload folder
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Use the original file name, or you can generate a unique name
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.post('/evaluate', upload.fields([{ name: 'planJson' }, { name: 'policyRego' }]), (req, res) => {
    const planFile = req.files.planJson[0].path; // Path to uploaded plan.json
    const regoFile = req.files.policyRego[0].path; // Path to uploaded policy.rego

    // Construct OPA eval command
    const command = `opa eval -i ${planFile} -d ${regoFile} "data.gcp.compute_engine.deny"`;

    // Execute the OPA eval command
    exec(command, (error, stdout, stderr) => {
        // Handle response
        if (error) {
            return res.status(500).json({ output: `Error: ${error.message}` });
        }
        if (stderr) {
            return res.status(500).json({ output: `Error: ${stderr}` });
        }
        res.json({ output: stdout });
    });
});

// Start server
app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
