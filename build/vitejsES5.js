const fs = require('fs');
const traversing = require('./traversing');

const resetPathList = [ './packages/vitejs/es5', './packages/vitejs/src' ];

resetPathList.forEach(path => {
    traversing(path, (fPath, next, val, folderLevel) => {
        const stats = fs.statSync(fPath);

        if (stats.isDirectory()) {
            next(fPath, `${ folderLevel }../`);
            return;
        }

        if (stats.isFile()) {
            formatFile(fPath, folderLevel);
        }
    }, './');
});

function formatFile(filePath, folderLevel) {
    let fileStr = fs.readFileSync(filePath, { encoding: 'utf8' });

    if (!fileStr.match(/(\~@vite\/vitejs\-)/)) {
        return;
    }

    fileStr = fileStr.replace(/(\~@vite\/vitejs-)/g, folderLevel);
    fs.writeFileSync(filePath, fileStr, 'utf8');
}
