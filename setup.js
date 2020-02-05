var path = require('path');
var fs = require('fs');
var prettier = require('prettier');

var questionsFolder = path.join(__dirname, '/public/question_answer_pairs');

// Get paths to each question directory
fs.readdir(questionsFolder, (error, files) => {
  if (error) {
    console.log("There was an error reading the public/question_answer_pairs directory: ", error);
  }
  var questionPathList = [];

  files.forEach(file => { questionPathList.push(file) });

  const result = questionPathList.map(question => {
    return `{question: '/question_answer_pairs/${question}/question.md', answer: '/question_answer_pairs/${question}/answer.md'},`
  }).join('');

  const finalResult = `
    // PLEASE NOTE THAT THIS IS AN AUTO-GENERATED FILE.
    // PLEASE DO NOT UPDATE
    const QaPairs = [
      ${result}
    ];

    export default QaPairs;
  `;

  fs.writeFileSync(path.join(__dirname, '/src/qa_pairs.js'), prettier.format(finalResult, { parser: 'babel' }));
});

// Create a file that imports the question.md and answer.md for each.