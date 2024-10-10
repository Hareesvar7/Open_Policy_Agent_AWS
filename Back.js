const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"; // OpenAI API URL

// Endpoint to handle policy generation using OpenAI
app.post('/generate-policy', async (req, res) => {
    const { prompt } = req.body; // Get the prompt from the request body

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
    }

    try {
        console.log('Received prompt:', prompt);  // Log the prompt received

        const response = await axios.post(OPENAI_API_URL, {
            model: "gpt-4", // Use GPT-4 or your desired model
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150 // Adjust based on your needs
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('OpenAI API response:', response.data); // Log the response from OpenAI

        // Send the response from OpenAI to the frontend
        res.json({ policy: response.data.choices[0].message.content });

    } catch (error) {
        // Log the error details to the server
        console.error("Error generating policy:", error.response ? error.response.data : error.message);
        
        // Respond with a 500 status and error message
        res.status(500).json({ error: "Error generating policy." });
    }
});

// Start the server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
