const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config();

const Config = {
    MONGO_URI: process.env.MONGO_URI,
    DATABASE_NAME: process.env.DATABASE_NAME,
    MONGO_TEST_URI: process.env.MONGO_TEST_URI,
    TEST_DATABASE_NAME: process.env.TEST_DATABASE_NAME,
    USE_TEST_DB: process.env.USE_TEST_DB === 'true',

    getDatabaseName: function() {
        return this.USE_TEST_DB ? this.TEST_DATABASE_NAME : this.DATABASE_NAME;
    },

    getMongoUri: function() {
        return this.USE_TEST_DB ? this.MONGO_TEST_URI : this.MONGO_URI;
    }
};

module.exports = Config;
