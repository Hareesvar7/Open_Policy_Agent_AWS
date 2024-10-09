const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' });

app.post('/evaluate', upload.fields([{ name: 'planJson' }, { name: 'policyRego' }]), (req, res) => {
  const planPath = req.files.planJson[0].path;
  const regoPath = req.files.policyRego[0].path;

  // Run OPA eval with both files
  const opaCommand = `opa eval --data ${regoPath} --input ${planPath} "data.main.allow"`;

  exec(opaCommand, (error, stdout, stderr) => {
    // Handle OPA execution errors
    if (error) {
      return res.status(500).json({ error: stderr || 'OPA evaluation failed' });
    }

    // Send OPA evaluation result
    res.json({ output: stdout });
    
    // Optionally delete uploaded files after evaluation
    fs.unlink(planPath, () => {});
    fs.unlink(regoPath, () => {});
  });
});

app.listen(4000, () => {
  console.log('OPA evaluation server running on port 4000');
});
