require('dotenv').config();
const MyConstants = {
    DB_SERVER: 'cluster0.7usgu.mongodb.net',
    DB_USER: 'thuan',
    DB_PASS: 'thuan',
    DB_DATABASE: 'shoppingonline',
    EMAIL_USER: '',
    EMAIL_PASS: '',
    JWT_SECRET: process.env.JWT_SECRET || 'kahsdkwhjsh',
    JWT_EXPIRES: '1d',
};
module.exports = MyConstants;

