var fs = require('fs');
var path = require('path');

const typePath = path.join(__dirname, '/src/type.ts');
const packageJsonContent = require('./common/package.json');

traversing('./packages/dist', (fPath, next, name) => {
    let stats = fs.statSync(fPath);
    if (!stats.isFile()) {
        return;
    }

    let packageName = name.split('.')[0];
    let packagePath = `packages/${packageName}`;
    
    if ( fs.existsSync(packagePath) ) {
        return;
    }

    fs.mkdirSync(packagePath);
    fs.writeFileSync(`${packagePath}/index.node.js`, fs.readFileSync(`packages/dist/${packageName}.node.js`));
    fs.writeFileSync(`${packagePath}/index.web.js`, fs.readFileSync(`packages/dist/${packageName}.web.js`));

    copyFile({
        fromPath: packagePath,
        name: packageName.toLowerCase() === 'vitejs' ? '@vite/vitejs' : `@vite/vitejs-${packageName.toLowerCase()}`
    });
});

traversing('./packages/dist', (fPath) => {
    fs.unlinkSync(fPath);
});
fs.rmdirSync('./packages/dist');




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

function copyFile({ fromPath, name }) {
    packageJsonContent.name = name;

    let typeFile = path.join(fromPath, '/type.ts');
    fs.writeFileSync(typeFile, fs.readFileSync(typePath));

    let packageFile = path.join(fromPath, '/package.json');
    fs.writeFileSync(packageFile, JSON.stringify(packageJsonContent));
}
