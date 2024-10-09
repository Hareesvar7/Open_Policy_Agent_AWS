const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for frontend requests

// API route to evaluate OPA policy
app.post('/evaluate', (req, res) => {
  // Define the paths for your plan.json and policy.rego files
  const planJsonPath = path.resolve(__dirname, 'planjson.json');  // Make sure this path is correct
  const policyRegoPath = path.resolve(__dirname, 'policyRego.rego');  // Make sure this path is correct

  // OPA eval command
  const command = `opa eval -i ${planJsonPath} -d ${policyRegoPath} "data.gcp.compute_engine.deny"`;

  // Execute the OPA eval command
  exec(command, (error, stdout, stderr) => {
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
