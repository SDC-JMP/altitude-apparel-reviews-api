const fs = require('fs');
const readline = require('readline');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

const etlLoad = (filename, model, callbacks) => {
  const rl = readline.createInterface({
    input: fs.createReadStream(path.join(dataDir, filename)),
    output: process.stdout,
    terminal: false
  });

  // const filenameArr = filename.split('.');
  // const newFileName = `${filenameArr[0]}_cleaned.${filenameArr[1]}`;

  // const writeStream = fs.createWriteStream(path.join(dataDir, newFileName), { encoding: 'utf8', flags: 'w' });
  // eslint-disable-next-line no-plusplus, no-param-reassign
  const lineCounter = ((i = 0) => () => ++i)();
  let dateIndex;
  let header;
  rl.on('line', (line, lineno = lineCounter()) => {
    if (lineno > 1) {
      const values = line.split(',');

      const utcSeconds = Number(values[dateIndex]) / 1000;
      const d = new Date(0);
      d.setUTCSeconds(utcSeconds);

      values[dateIndex] = d.toISOString();
      const newline = values.join(',');
      if (lineno % 10000 === 0) {
        // eslint-disable-next-line no-console
        console.log(`Completed: ${lineno}`);
      }

      writeStream.write(`${newline}\n`);
    } else {
      header = line.split(',');

      for (let i = 0; i < header.length; i += 1) {
        if (header[i] === 'date') {
          dateIndex = i;
          break;
        }
      }
      writeStream.write(`${line}\n`);
    }
  });

  rl.on('close', () => {
    // eslint-disable-next-line no-console
    console.log('Completed Conversion');
    writeStream.close();
  });
};

const identity = (value) => value;

const cleanDate = (value) => {
  const utcSeconds = Number(value) / 1000;
  const d = new Date(0);
  d.setUTCSeconds(utcSeconds);

  return d.toISOString();
};

const limitLength = (limit) => (value) => {
  if (value.length > limit) {
    value.slice(0, limit);
  }
};

etlLoad(
  'reviews.csv',
  [
    identity,
    identity,
    identity,
    cleanDate,
    limitLength(60),
    limitLength(1000),
    identity,
    identity,
    limitLength(60),
    limitLength(60),
    limitLength(1000),
    identity
  ]
);
