require('dotenv').config();
const axios = require('axios');

async function generatePolicy(prompt) {
    const response = await axios.post(
        'https://api.openai.com/v1/completions',
        {
            model: "text-davinci-003", // Choose the appropriate model
            prompt: prompt,
            max_tokens: 150, // Adjust as needed
            n: 1,
            stop: null,
        },
        {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        }
    );

    return response.data.choices[0].text.trim();
}

// Example usage:
(async () => {
    const prompt = "Generate an OPA policy for S3 bucket encryption.";
    const policy = await generatePolicy(prompt);
    console.log("Generated Policy:", policy);
})();
