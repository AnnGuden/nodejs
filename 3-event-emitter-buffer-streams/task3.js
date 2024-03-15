const { promisify } = require('node:util');
const stream = require('stream');
const fs = require('node:fs');
const once = require('events');
const csvtojson = require('csvtojson');

const csvFilePath = './csv/example.csv';
const txtFilePath = './csv/example.txt';

const finished = promisify(stream.finished);

async function writeIterableToFile(iterable, filePath) {
    const writable = fs.createWriteStream(filePath, { encoding: 'utf8' });
    writable.on('error', (error) => {
        console.error('Write error:', error);
    })
    for await (const chunk of iterable) {
        if (!writable.write(chunk)) {
            await once(writable, 'drain');
        }
    }
    writable.end();
    await finished(writable);
}

async function convertCsvToJsonAndSave(csvFilePath, txtFilePath) {
    try {
        const csvJsonArray = await csvtojson().fromFile(csvFilePath);
        const iterable = csvJsonArray.map((item) => JSON.stringify(item) + '\n');
        await writeIterableToFile(iterable, txtFilePath);
        console.log('Conversion completed successfully.');
    } catch (error) {
        console.error('An error occurred during the conversion:', error);
    }
}

convertCsvToJsonAndSave(csvFilePath, txtFilePath);