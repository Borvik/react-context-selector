const path = require('path');
const fs = require('fs');
const sass = require('node-sass');
const mkdirp = require('mkdirp');

const distFolder = path.join(__dirname, '..', 'dist');
const rawFile = 'src/library/index.scss';
const actualFile = path.join(__dirname, '..', rawFile);
const outFile = path.join(__dirname, '..', 'dist/index.css');

if (!fs.existsSync(actualFile)) {
  console.log('No css to build');
  process.exit(0);
}

console.log('Building css');
mkdirp.sync(distFolder);
sass.render({
  file: actualFile,
  outFile,
  outputStyle: 'nested',
  sourceMap: true,
}, (err, result) => {
  if (err) {
    console.error(err.message);
    process.exist(1);
  }
  fs.writeFileSync(outFile, result.css);
  fs.writeFileSync(outFile + '.map', result.map);
  console.log('Building css... completed');
  process.exit(0);
});