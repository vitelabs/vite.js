var fs = require('fs');
var path = require('path');

const typePath = path.join(__dirname, 'type.ts');

traversing('./packages', (fPath) => {
    let stats = fs.statSync(fPath);
    if (stats.isFile()) {
        return;
    }

    let toFile = path.join(fPath, '/src/type.ts');
    let toFileIndex = path.join(fPath, '/src/index.d.ts');

    fs.existsSync(toFile) && fs.unlinkSync(toFile);
    fs.writeFileSync(toFile, fs.readFileSync(typePath));
    fs.writeFileSync(toFile, fs.readFileSync(typePath));

    fs.existsSync(toFileIndex) && fs.unlinkSync(toFileIndex);
    // fs.writeFileSync(toFileIndex, fs.readFileSync(typePath));
    // fs.writeFileSync(toFileIndex, fs.readFileSync(typePath));
    // console.log(toFile, val);
});


function traversing (startPath, cb) {
    function readdirSync (startPath) {
        let files = fs.readdirSync(startPath);

        files.forEach((val) => {
            let fPath = path.join(startPath, val);
            cb && cb(fPath, readdirSync, val);
        });
    }
    readdirSync(startPath);
}