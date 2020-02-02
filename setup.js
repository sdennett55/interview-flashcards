var path = require('path');
var fs = require('fs');
var prettier = require('prettier');

var questionsFolder = path.join(__dirname, '/public/questions');

// Get paths to each question directory
fs.readdir(questionsFolder, (error, files) => {
  if (error) {
    console.log("There was an error reading the public/questions directory: ", error);
  }
  var questionPathList = [];

  files.forEach(file => { questionPathList.push(file) });

  const result = questionPathList.map(question => {
    return `{question: '/questions/${question}/question.md', answer: '/questions/${question}/answer.md'},`
  }).join('');

  const finalResult = `
    // PLEASE NOTE THAT THIS IS AN AUTO-GENERATED FILE.
    // PLEASE DO NOT UPDATE
    const questions = [
      ${result}
    ];

    export default questions;
  `;

  fs.writeFileSync(path.join(__dirname, '/src/questions.js'), prettier.format(finalResult, { parser: 'babel' }));
});

// Create a file that imports the question.md and answer.md for each.