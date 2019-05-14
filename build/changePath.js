const fs = require('fs');
const path = require('path');
const traversing = require('./traversing');

const typePath = path.join(__dirname, '../src/type.ts');
const packageJsonContent = require('../common/package.json');
const currPackageJsonContent = require('../package.json');
const lernaJsonContent = require('../lerna.json');

// Change `packages/dist/${packageName}.${"node"||"web"}.js` to `${packageName}/index.${"node"||"web"}.js`
traversing('./packages/dist', (fPath, next, name) => {
    const stats = fs.statSync(fPath);
    if (!stats.isFile()) {
        return;
    }

    const packageName = name.split('.')[0];
    const packagePath = path.join(__dirname, `../packages/${ packageName }`);

    if (fs.existsSync(packagePath)) {
        return;
    }

    fs.mkdirSync(packagePath);
    fs.writeFileSync(`${ packagePath }/index.node.js`, fs.readFileSync(`packages/dist/${ packageName }.node.js`));
    fs.writeFileSync(`${ packagePath }/index.web.js`, fs.readFileSync(`packages/dist/${ packageName }.web.js`));

    copyFile({
        fromPath: `./packages/${ packageName }`,
        name: packageName.toLowerCase() === 'vitejs' ? '@vite/vitejs' : `@vite/vitejs-${ packageName.toLowerCase() }`
    });
});

// Delete packages/dist
traversing('./packages/dist', fPath => {
    fs.unlinkSync(fPath);
});
fs.rmdirSync('./packages/dist');



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
