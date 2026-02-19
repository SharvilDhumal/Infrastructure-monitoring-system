const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');

function checkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            checkDir(fullPath);
        } else if (file.endsWith('.jsx')) {
            const code = fs.readFileSync(fullPath, 'utf8');
            try {
                parse(code, {
                    sourceType: 'module',
                    plugins: ['jsx']
                });
                console.log(`OK: ${fullPath}`);
            } catch (e) {
                console.error(`ERROR in ${fullPath}: ${e.message}`);
                console.error(e.loc);
            }
        }
    }
}

checkDir(process.argv[2] || 'src');
