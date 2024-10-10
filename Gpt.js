require('dotenv').config();
const axios = require('axios');

async function generatePolicy(prompt) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo", // You can replace with "gpt-4" if you have access
                messages: [
                    { role: "system", content: "You are an expert in generating OPA policies." }, // System message to set the context
                    { role: "user", content: prompt } // The user prompt for the AI
                ],
                max_tokens: 150, // Adjust based on your needs
                n: 1,
                stop: null
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Extract the policy from the response
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating policy:', error.response ? error.response.data : error.message);
        throw new Error('Failed to generate policy');
    }
}

// Example usage:
(async () => {
    const prompt = "Generate an OPA policy for S3 bucket encryption.";
    try {
        const policy = await generatePolicy(prompt);
        console.log("Generated Policy:", policy);
    } catch (error) {
        console.error('Failed to generate the policy:', error.message);
    }
})();
