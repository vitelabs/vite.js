const fs = require('fs');
const path = require('path');
const traversing = require('./traversing');

const typePath = path.join(__dirname, '../src/type.ts');
const packageJsonContent = require('../common/package.json');
const currPackageJsonContent = require('../package.json');
const lernaJsonContent = require('../lerna.json');

// Change `dist/${packageName}.${"node"||"web"}.js` to `src/${packageName}/index.${"node"||"web"}.js`
traversing('./dist', (fPath, next, name) => {
    const stats = fs.statSync(fPath);
    if (!stats.isFile()) {
        return;
    }

    const packageName = name.split('.')[0];
    const packagePath = path.join(__dirname, `../src/${ packageName }`);
    const distPath = path.join(__dirname, `../src/${ packageName }/dist`);

    if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath);
    }

    fs.writeFileSync(`${ distPath }/index.node.js`, fs.readFileSync(`dist/${ packageName }.node.js`));
    fs.writeFileSync(`${ distPath }/index.web.js`, fs.readFileSync(`dist/${ packageName }.web.js`));

    copyFile({
        fromPath: packagePath,
        name: packageName.toLowerCase() === 'vitejs' ? '@vite/vitejs' : `@vite/vitejs-${ packageName.toLowerCase() }`
    });
});


function copyFile({ fromPath, name }) {
    packageJsonContent.name = name;
    packageJsonContent.version = lernaJsonContent.version;

    if (name === '@vite/vitejs') {
        packageJsonContent.dependencies = currPackageJsonContent.dependencies;
    }

    const typeFile = path.join(fromPath, './type.ts');
    fs.writeFileSync(typeFile, fs.readFileSync(typePath));

    const packageFile = path.join(fromPath, './package.json');
    fs.writeFileSync(packageFile, JSON.stringify(packageJsonContent));
}
