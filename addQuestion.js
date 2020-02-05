const fs = require('fs');
const path = require('path');

const questionsDir = path.join(__dirname, '/public/question_answer_pairs');

// If progress.argv exists, use that name, otherwise 
function getDirectoryName() {
  if (process.argv[2]) {
    return path.join(questionsDir, `/${process.argv[2]}`);
  } else {
    const num = fs.readdirSync(questionsDir).length + 1;
    return path.join(questionsDir, `qa_pair${num}`);
  }
}

const directoryName = getDirectoryName();

fs.mkdirSync(directoryName);
fs.writeFileSync(path.join(directoryName, 'question.md'), '## Question:');
fs.writeFileSync(path.join(directoryName, 'answer.md'), '## Answer:');