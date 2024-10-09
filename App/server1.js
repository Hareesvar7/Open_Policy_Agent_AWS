const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS to allow requests from the React frontend
app.use(cors());

// Set up multer for file uploads (memory storage for temporary files)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Endpoint to handle file upload and OPA eval
app.post('/evaluate', upload.fields([{ name: 'planJson' }, { name: 'planReg' }]), (req, res) => {
    const planJsonFile = req.files['planJson'][0]; // Access the plan.json file
    const planRegFile = req.files['planReg'][0];   // Access the plan.rego file

    // Create temporary files in the current directory
    const planJsonPath = path.join(__dirname, planJsonFile.originalname);
    const planRegPath = path.join(__dirname, planRegFile.originalname);

    // Write the files to the filesystem
    fs.writeFileSync(planJsonPath, planJsonFile.buffer);
    fs.writeFileSync(planRegPath, planRegFile.buffer);

    // Prepare OPA eval command
    const command = `opa eval -i ${planJsonPath} -d ${planRegPath} "data.gcp.deny"`; // Adjust your policy path accordingly

    exec(command, (error, stdout, stderr) => {
        // Cleanup temporary files
        fs.unlinkSync(planJsonPath);
        fs.unlinkSync(planRegPath);

        if (error) {
            console.error(`Error executing OPA eval: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }

        // Send the output to the frontend
        res.json({ output: stdout.trim(), error: stderr.trim() });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
