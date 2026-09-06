// Direct test of the generateRecipe controller
require('dotenv').config();

async function testGenerateRecipe() {
    try {
        console.log('Loading controller...');
        const { generateRecipe } = require('./controllers/aiController');

        console.log('Creating mock request/response...');
        const mockReq = {
            body: { ingredients: 'veg biriyani' },
            user: { _id: 'test-user-id' }
        };

        let responseData = null;
        let responseStatus = null;

        const mockRes = {
            status: function (code) {
                responseStatus = code;
                console.log(`\nResponse Status: ${code}`);
                return this;
            },
            json: function (data) {
                responseData = data;
                console.log('\nResponse Data:');
                console.log(JSON.stringify(data, null, 2));
                return this;
            }
        };

        console.log('\nCalling generateRecipe...\n');
        await generateRecipe(mockReq, mockRes);

        console.log('\n✅ Test completed successfully!');
        if (responseStatus === 200 && responseData) {
            console.log(`\n📝 Recipe generated: ${responseData.title}`);
        }

    } catch (error) {
        console.error('\n❌ ERROR:', error);
        console.error('\nStack trace:');
        console.error(error.stack);
    }
}

testGenerateRecipe();
