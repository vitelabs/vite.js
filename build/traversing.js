const fs = require('fs');
const path = require('path');

module.exports = function traversing(startPath, cb, folderLevel) {
    function readdirSync(startPath, folderLevel) {
        const files = fs.readdirSync(startPath);

        files.forEach(val => {
            const fPath = path.join(startPath, val);
            cb && cb(fPath, readdirSync, val, folderLevel);
        });
    }
    readdirSync(startPath, folderLevel);
};
