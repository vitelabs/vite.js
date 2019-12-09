const fs = require('fs');
const path = require('path');
const traversing = require('./traversing');

const packageJsonContent = require('../common/package.json');
const currPackageJsonContent = require('../package.json');
// const currTsConfigJsonContent = require('../tsconfig.json');
const lernaJsonContent = require('../lerna.json');

// Change `dist/${packageName}.${"node"||"web"}.js` to `packages/${packageName}/index.${"node"||"web"}.js`
traversing('./dist', (fPath, next, name) => {
    const stats = fs.statSync(fPath);
    if (!stats.isFile()) {
        return;
    }

    const packageName = name.split('.')[0];
    const packagePath = path.join(__dirname, `../packages/${ packageName }`);
    const distPath = path.join(__dirname, `../packages/${ packageName }/dist`);

    if (!fs.existsSync(packagePath)) {
        fs.mkdirSync(packagePath);
    }
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

    const packageFile = path.join(fromPath, './package.json');
    fs.writeFileSync(packageFile, JSON.stringify(packageJsonContent));

    if (name !== '@vite/vitejs') {
        return;
    }

    packageJsonContent.dependencies = currPackageJsonContent.dependencies;
    packageJsonContent.types = './src/index.ts';

    const indexTSPath = path.join(fromPath, './index.ts');
    if (fs.existsSync(indexTSPath)) {
        fs.unlinkSync(indexTSPath);
    }

    // const tsConfigFile = path.join(fromPath, './tsconfig.json');
    // delete currTsConfigJsonContent.compilerOptions.outDir;
    // fs.writeFileSync(tsConfigFile, JSON.stringify(currTsConfigJsonContent));
}
