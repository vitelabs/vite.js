const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('./src');
const typePath = path.join(__dirname, '../src/type.ts');

files.forEach(val => {
    const firstP = path.join('./src', `${ val }`);
    const stats = fs.statSync(firstP);
    if (stats.isFile()) {
        return;
    }

    const currTypePath = path.join(firstP, './type.ts');
    fs.writeFileSync(currTypePath, fs.readFileSync(typePath));
});
