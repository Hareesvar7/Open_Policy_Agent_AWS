const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Allow requests from frontend

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for requests from the React app

// Sample API route to send sample policy execution text
app.post('/evaluate', (req, res) => {
  // You can create a sample execution message or text here
  const sampleText = `
    OPA policy execution completed successfully!
    - Policy: EC2 security group rule validation
    - Result: No violations found
    - Execution Time: 200ms
  `;

  // Send this sample text as the response
  res.json({ output: sampleText });
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
