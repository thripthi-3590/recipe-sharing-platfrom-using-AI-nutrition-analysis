/**
 * Helper script to test a new Gemini API key
 * Usage: node test_new_api_key.js YOUR_API_KEY_HERE
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testAPIKey(apiKey) {
    console.log('🔍 Testing Gemini API Key...\n');
    console.log(`Key: ${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length - 5)}\n`);

    const modelsToTry = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-pro'
    ];

    for (const modelName of modelsToTry) {
        try {
            console.log(`Testing model: ${modelName}...`);
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: modelName });

            const result = await model.generateContent('Say "Hello, I am working!" in 5 words or less.');
            const response = await result.response;
            const text = response.text();

            console.log(`✅ SUCCESS with ${modelName}!`);
            console.log(`Response: "${text}"\n`);
            console.log('='.repeat(60));
            console.log('✨ Your API key is working! Update your .env file with this key.');
            console.log('='.repeat(60));
            return true;
        } catch (error) {
            console.log(`❌ Failed with ${modelName}: ${error.message}\n`);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('❌ All models failed. Possible reasons:');
    console.log('   1. API key is invalid');
    console.log('   2. API key hasn\'t been activated yet (wait a few minutes)');
    console.log('   3. Billing needs to be enabled in Google Cloud Console');
    console.log('='.repeat(60));
    return false;
}

// Get API key from command line argument or prompt for it
const apiKey = process.argv[2];

if (!apiKey) {
    console.log('Usage: node test_new_api_key.js YOUR_API_KEY_HERE');
    console.log('\nOr test the current .env key:');
    console.log('node test_new_api_key.js $(grep GEMINI_API_KEY .env | cut -d "=" -f2)');
    process.exit(1);
}

testAPIKey(apiKey);
