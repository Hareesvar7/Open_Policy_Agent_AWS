const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

app.use(bodyParser.json({ limit: '50mb' }));

// API to evaluate OPA policy
app.post('/evaluate', async (req, res) => {
  try {
    const { planJson, planRego } = req.body;

    // Save the plan.json and plan.rego files to disk temporarily
    const planJsonPath = path.join(__dirname, 'plan.json');
    const planRegoPath = path.join(__dirname, 'policy.rego');
    
    fs.writeFileSync(planJsonPath, Buffer.from(planJson, 'base64').toString('utf-8'));
    fs.writeFileSync(planRegoPath, Buffer.from(planRego, 'base64').toString('utf-8'));

    // Run OPA eval using the plan.json and policy.rego files
    exec(`opa eval --data ${planRegoPath} --input ${planJsonPath}`, (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        return res.status(500).json({ output: stderr });
      }

      // Return the output of opa eval back to the client
      return res.json({ output: stdout });
    });
  } catch (error) {
    console.error('Error in OPA evaluation:', error);
    return res.status(500).json({ output: 'Error in OPA evaluation' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
