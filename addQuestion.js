const fs = require('fs');
const path = require('path');

const questionsDir = path.join(__dirname, '/public/question_answer_pairs');

async function createDirectory() {
  const filesNum = fs.readdirSync(questionsDir).length;
  const num = filesNum + 1;
  const directoryName = path.join(questionsDir, `qa_pair${num}`);
  fs.mkdirSync(directoryName);
  fs.writeFileSync(path.join(directoryName, 'question.md'), `## Question ${num}`);
  fs.writeFileSync(path.join(directoryName, 'answer.md'), `## Answer ${num}`);
  console.log(`Successfully created a new directory: ${directoryName}`);
}

if (process.argv[2] && !isNaN(process.argv[2])) {
  (async () => {
    const num = Number(process.argv[2]);
    for (let x = 0; x < num; x++) {
      await createDirectory(x + 1);
    }  
  })();
} else {
  createDirectory();
}