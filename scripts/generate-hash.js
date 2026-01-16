/**
 * Utility script to generate bcrypt hash for a password
 * Usage: node scripts/generate-hash.js <password>
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
    console.error('Usage: node scripts/generate-hash.js <password>');
    process.exit(1);
}

const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('Error generating hash:', err);
        process.exit(1);
    }
    console.log(`\nPassword: ${password}`);
    console.log(`Hash:     ${hash}\n`);
    console.log('Add this hash to your .env file as ADMIN_PASSWORD_HASH (future) or use it for verification.');
});
