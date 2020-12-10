const path = require('path')

const dotenv = require('dotenv')

const result = dotenv.config({ path : path.resolve(process.cwd(), 'src/config/.env')});

if (result.error) {
    throw result.error;
}

module.exports = process.env;