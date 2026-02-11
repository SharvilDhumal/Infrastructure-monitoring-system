const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

console.log('--- Checking Google Credentials ---');

const checkVar = (key, value) => {
    if (!value) {
        console.error(`❌ ${key} is MISSING`);
        return;
    }

    console.log(`Checking ${key}...`);
    console.log(`  Raw Length: ${value.length}`);

    // Check for whitespace
    if (value.trim() !== value) {
        console.error(`  ❌ WARNING: ${key} has leading/trailing whitespace!`);
        console.log(`  Actual value: "${value}"`);
    } else {
        console.log(`  ✅ No whitespace detected.`);
    }

    // Check for special characters that might be confusing
    if (key === 'GOOGLE_CLIENT_ID' && !value.endsWith('.apps.googleusercontent.com')) {
        console.error(`  ❌ WARNING: ${key} does not end with .apps.googleusercontent.com`);
    }

    if (key === 'GOOGLE_CLIENT_SECRET') {
        if (!value.startsWith('GOCSPX-')) {
            console.warn(`  ⚠️  NOTE: ${key} does not start with GOCSPX- (This might be okay for older keys but unusual for new ones)`);
        }
    }

    console.log(`  First 5 chars: ${value.substring(0, 5)}`);
    console.log(`  Last 5 chars: ${value.substring(value.length - 5)}`);
};

checkVar('GOOGLE_CLIENT_ID', envConfig.GOOGLE_CLIENT_ID);
checkVar('GOOGLE_CLIENT_SECRET', envConfig.GOOGLE_CLIENT_SECRET);
checkVar('GOOGLE_CALLBACK_URL', envConfig.GOOGLE_CALLBACK_URL);

console.log('\n--- Done ---');
