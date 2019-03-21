const fs = require('fs');
const path = require('path');

const typePath = path.join(__dirname, '/src/type.ts');
const packageJsonContent = require('./common/package.json');

traversing('./packages/dist', (fPath, next, name) => {
    const stats = fs.statSync(fPath);
    if (!stats.isFile()) {
        return;
    }

    const packageName = name.split('.')[0];
    const packagePath = `packages/${ packageName }`;

    if (fs.existsSync(packagePath)) {
        return;
    }

    fs.mkdirSync(packagePath);
    fs.writeFileSync(`${ packagePath }/index.node.js`, fs.readFileSync(`packages/dist/${ packageName }.node.js`));
    fs.writeFileSync(`${ packagePath }/index.web.js`, fs.readFileSync(`packages/dist/${ packageName }.web.js`));

    copyFile({
        fromPath: packagePath,
        name: packageName.toLowerCase() === 'vitejs' ? '@vite/vitejs' : `@vite/vitejs-${ packageName.toLowerCase() }`
    });
});

traversing('./packages/dist', fPath => {
    fs.unlinkSync(fPath);
});
fs.rmdirSync('./packages/dist');


function traversing(startPath, cb) {
    function readdirSync(startPath) {
        const files = fs.readdirSync(startPath);

        files.forEach(val => {
            const fPath = path.join(startPath, val);
            cb && cb(fPath, readdirSync, val);
        });
    }
    readdirSync(startPath);
}

function copyFile({ fromPath, name }) {
    packageJsonContent.name = name;

    const typeFile = path.join(fromPath, '/type.ts');
    fs.writeFileSync(typeFile, fs.readFileSync(typePath));

    const packageFile = path.join(fromPath, '/package.json');
    fs.writeFileSync(packageFile, JSON.stringify(packageJsonContent));
}
