const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Helper function for exponential backoff retry logic
async function callOpenAI(prompt) {
    const maxRetries = 5;  // Maximum number of retries
    let delay = 1000;      // Initial delay (1 second)
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await axios.post(OPENAI_API_URL, {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 150  // Adjust based on your needs
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            // Return the content of the response from OpenAI
            return response.data.choices[0].message.content;
        } catch (error) {
            // Handle rate limiting (HTTP 429) by retrying with exponential backoff
            if (error.response && error.response.status === 429) {
                console.warn(`Rate limit exceeded. Retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponentially increase the delay for each retry
            } else {
                // Log any other errors
                console.error("Error calling OpenAI:", error.message || error);
                throw new Error("Failed to generate policy. Please try again.");
            }
        }
    }

    throw new Error("Failed to call OpenAI API after multiple attempts.");
}

// Endpoint to handle policy generation using OpenAI
app.post('/generate-policy', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
    }

    try {
        const generatedPolicy = await callOpenAI(prompt);
        res.json({ policy: generatedPolicy });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
