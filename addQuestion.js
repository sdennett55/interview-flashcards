const fs = require('fs');
const path = require('path');

const questionsDir = path.join(__dirname, '/public/question_answer_pairs');

async function createDirectory(index = 1) {
  const filesNum = fs.readdirSync(questionsDir).length;
  const num = filesNum + 1;
  const directoryName = path.join(questionsDir, `qa_pair${num}`);
  fs.mkdirSync(directoryName);
  fs.writeFileSync(path.join(directoryName, 'question.md'), `## Question ${num}`);
  fs.writeFileSync(path.join(directoryName, 'answer.md'), `## Answer ${num}`);
}

if (process.argv[2] && !isNaN(process.argv[2])) {
  const forLoop = async () => {
    const num = Number(process.argv[2]);
    for (let x = 0; x < num; x++) {
      console.log(x + 1);
      await createDirectory(x + 1);
    }  
  }
  forLoop();
} else {
  createDirectory();
}