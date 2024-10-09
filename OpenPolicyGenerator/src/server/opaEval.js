const { exec } = require('child_process');

const evalPolicy = (planJsonPath, planRegPath, policyPath) => {
    return new Promise((resolve, reject) => {
        const command = `opa eval -i ${planJsonPath} -d ${planRegPath} "${policyPath}"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(`Error: ${stderr || error.message}`);
            }
            resolve(stdout);
        });
    });
};

module.exports = evalPolicy;
