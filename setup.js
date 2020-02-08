var path = require('path');
var fs = require('fs');
var prettier = require('prettier');

var questionsFolder = path.join(__dirname, '/public/question_answer_pairs');

// Get paths to each question directory
fs.readdir(questionsFolder, (error, directories) => {
  if (error) {
    console.log("There was an error reading the public/question_answer_pairs directory: ", error);
  }

  const dirObjects = directories.map(directory => {
    return `{question: '/question_answer_pairs/${directory}/question.md', answer: '/question_answer_pairs/${directory}/answer.md'},`
  }).join('');

  const qaPairsFile = `
    // PLEASE NOTE THAT THIS IS AN AUTO-GENERATED FILE.
    // PLEASE DO NOT UPDATE
    const QaPairs = [
      ${dirObjects}
    ];

    export default QaPairs;
  `;

  fs.writeFileSync(path.join(__dirname, '/src/qa_pairs.js'), prettier.format(qaPairsFile, { parser: 'babel' }));
});