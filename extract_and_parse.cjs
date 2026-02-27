const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const pdfPath = 'D:/interview_preparational/src/Top-500-DotNet-Interview-Questions-PDF.pdf';
let dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function (data) {
    const text = data.text;
    const startIndex = text.indexOf('Chapter 1 – OOPS/ C#');
    const contentText = startIndex !== -1 ? text.substring(startIndex) : text;

    const qRegex = /Q(\d+)\.\s+([^\n]+)/g;
    let match;
    const questions = [];
    let lastIndex = 0;
    let lastQuestion = "";
    let lastQNum = 0;

    while ((match = qRegex.exec(contentText)) !== null) {
        if (lastQuestion) {
            let answerText = contentText.substring(lastIndex, match.index).trim();
            answerText = answerText.replace(/\n\s*\d+\s*\n/g, '\n');
            questions.push({
                id: lastQNum,
                question: lastQuestion,
                answer: answerText
            });
        }
        lastQNum = parseInt(match[1]);
        lastQuestion = match[2].trim();
        lastIndex = qRegex.lastIndex;
    }

    if (lastQuestion) {
        questions.push({
            id: lastQNum,
            question: lastQuestion,
            answer: contentText.substring(lastIndex).trim().replace(/\n\s*\d+\s*\n/g, '\n')
        });
    }

    const outDir = 'D:/interview_preparational/src/data';
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(path.join(outDir, 'questions.json'), JSON.stringify(questions, null, 2));
    console.log(`Successfully parsed ${questions.length} questions from the PDF directly.`);
}).catch(console.error);
