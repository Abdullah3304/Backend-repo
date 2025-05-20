const bcrypt = require('bcryptjs');

async function testPassword(password) {
    // Manually hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    // Test the comparison process
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log("Password match:", isMatch); // This should return true

    return { hashedPassword, isMatch };
}

// Test with a sample password
const password = 'testpassword123';
testPassword(password);
