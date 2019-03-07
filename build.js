var fs = require('fs');
var path = require('path');

const typePath = path.join(__dirname, '/common/type.ts');
var tsconfigContent = require('./common/tsconfig.js');

traversing('./packages', (fPath) => {
    let stats = fs.statSync(fPath);
    if (stats.isFile()) {
        return;
    }

    let toFile = path.join(fPath, '/src/type.ts');
    let tsconfigFile = path.join(fPath, '/tsconfig.json');

    fs.existsSync(toFile) && fs.unlinkSync(toFile);
    fs.writeFileSync(toFile, fs.readFileSync(typePath));

    fs.existsSync(tsconfigFile) && fs.unlinkSync(tsconfigFile);
    fs.writeFileSync(tsconfigFile, JSON.stringify(tsconfigContent));
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