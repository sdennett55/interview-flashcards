const execSync = require('child_process').execSync;

const arg = process.argv[2] || 1;

execSync('node addQuestion.js ' + arg, {stdio:[0, 1, 2]});
execSync('node setup.js', {stdio:[0, 1, 2]});