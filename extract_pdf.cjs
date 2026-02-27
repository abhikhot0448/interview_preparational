const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('C:/Users/abhik/Downloads/Top-500-DotNet-Interview-Questions-PDF.pdf');

pdf(dataBuffer).then(function (data) {
    fs.writeFileSync('./pdf_output.txt', data.text);
    console.log("Successfully extracted text. Total pages: " + data.numpages);
}).catch(err => {
    console.error(err);
});
