const fs = require('fs');
const traversing = require('./traversing');

traversing('./src/vitejs/es5', (fPath, next, val, folderLevel) => {
    const stats = fs.statSync(fPath);

    if (stats.isDirectory()) {
        next(fPath, `${ folderLevel }../`);
        return;
    }

    if (stats.isFile()) {
        formatFile(fPath, folderLevel);
    }
}, './');

traversing('./src/vitejs/distSrc', (fPath, next, val, folderLevel) => {
    const stats = fs.statSync(fPath);

    if (stats.isDirectory()) {
        next(fPath, `${ folderLevel }../`);
        return;
    }

    if (stats.isFile()) {
        formatFile(fPath, folderLevel);
    }
}, './');


function formatFile(filePath, folderLevel) {
    let fileStr = fs.readFileSync(filePath, { encoding: 'utf8' });

    if (!fileStr.match(/(\~@vite\/vitejs\-)/)) {
        return;
    }
    fileStr = fileStr.replace(/(\~@vite\/vitejs-accountblock)/g, "~@vite/vitejs-accountBlock");
    fileStr = fileStr.replace(/(\~@vite\/vitejs-viteapi)/g, "~@vite/vitejs-viteAPI");
    fileStr = fileStr.replace(/(\~@vite\/vitejs-)/g, folderLevel);
    fs.writeFileSync(filePath, fileStr, 'utf8');
}
