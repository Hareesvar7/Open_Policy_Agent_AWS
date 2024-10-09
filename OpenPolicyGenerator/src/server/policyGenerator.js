const axios = require('axios');

const generatePolicy = async (prompt) => {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo', // Adjust the model as needed
        messages: [{ role: 'user', content: prompt }],
    }, {
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
    });
    return response.data.choices[0].message.content;
};

module.exports = generatePolicy;
