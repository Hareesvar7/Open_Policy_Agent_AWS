const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for frontend requests

const upload = multer({ dest: 'uploads/' }); // Directory for temporary file storage

// API route to evaluate OPA policy
app.post('/evaluate', upload.fields([{ name: 'planJson' }, { name: 'policyRego' }]), (req, res) => {
  const planFile = req.files.planJson[0].path; // Get path of uploaded plan.json
  const regoFile = req.files.policyRego[0].path; // Get path of uploaded policy.rego

  // OPA eval command with dynamic file paths
  const command = `opa eval -i ${planFile} -d ${regoFile} "data.gcp.compute_engine.deny"`;

  // Execute the OPA eval command
  exec(command, (error, stdout, stderr) => {
    // Cleanup: delete uploaded files
    fs.unlinkSync(planFile);
    fs.unlinkSync(regoFile);

    if (error) {
      console.error(`Error executing OPA eval: ${error.message}`);
      return res.status(500).json({ output: `Error: ${error.message}` });
    }

    if (stderr) {
      console.error(`Error output from OPA eval: ${stderr}`);
      return res.status(500).json({ output: `Error: ${stderr}` });
    }

    // Send OPA eval output back to frontend
    res.json({ output: stdout });
  });
});

// Start server on port 4000
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
