const fs = require('fs');
const path = require('path');
const traversing = require('./traversing');

const files = fs.readdirSync('./src');

files.forEach(val => {
    const firstP = path.join('./src', `${ val }`);
    let stats = fs.statSync(firstP);
    if (stats.isFile()) {
        return;
    }

    if (val === 'vitejs') {
        const es5Path = path.join(firstP, 'es5');
        if (fs.existsSync(es5Path)) {
            deleteFolder(es5Path);
        }
    }

    const fPath = path.join(firstP, 'dist');
    if (!fs.existsSync(fPath)) {
        return;
    }

    stats = fs.statSync(fPath);
    if (stats.isFile()) {
        return;
    }

    deleteFolder(fPath);
});



function deleteFolder(fPath) {
    traversing(fPath, p => {
        stats = fs.statSync(p);
        if (!stats.isFile()) {
            deleteFolder(p);
            return;
        }
        fs.unlinkSync(p);
    });
    fs.rmdirSync(fPath);
}
