const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI ;
const PORT = process.env.PORT || 5173;


module.exports = {MONGO_URI, PORT};
