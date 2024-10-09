const axios = require('axios');

const fetchPolicies = async () => {
    const response = await axios.get('https://raw.githubusercontent.com/yourusername/yourrepo/main/policies.json'); // Replace with your GitHub repo link
    return response.data;
};

module.exports = fetchPolicies;
