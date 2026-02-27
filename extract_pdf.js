import fs from 'fs';
import pdf from 'pdf-parse';

let dataBuffer = fs.readFileSync('C:/Users/abhik/Downloads/Top-500-DotNet-Interview-Questions-PDF.pdf');

console.log('Export type:', typeof pdf, Object.keys(pdf));

if (typeof pdf === 'function') {
    pdf(dataBuffer).then(function (data) {
        fs.writeFileSync('./pdf_output.txt', data.text);
        console.log("Successfully extracted text. Total pages: " + data.numpages);
    }).catch(err => {
        console.error(err);
    });
} else if (typeof pdf.default === 'function') {
    pdf.default(dataBuffer).then(function (data) {
        fs.writeFileSync('./pdf_output.txt', data.text);
        console.log("Successfully extracted text. Total pages: " + data.numpages);
    }).catch(err => {
        console.error(err);
    });
} else if (typeof pdf.PDFParse === 'function') {
    pdf.PDFParse(dataBuffer).then(function (data) {
        fs.writeFileSync('./pdf_output.txt', data.text);
        console.log("Successfully extracted text. Total pages: " + data.numpages);
    }).catch(err => {
        console.error(err);
    });
} else {
    console.error("Could not find the parser function.");
}
