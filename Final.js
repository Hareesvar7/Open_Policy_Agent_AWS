const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,  // Store API key in an environment variable
});
const openai = new OpenAIApi(configuration);

// Route to handle GPT-3 API call
app.post('/generate', async (req, res) => {
    const { text } = req.body;

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003', // Using GPT-3 model
            prompt: text,
            max_tokens: 150,  // Limit the response to 150 tokens
        });

        const generatedText = response.data.choices[0].text;
        res.status(200).json({ result: generatedText });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error generating response from OpenAI' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
