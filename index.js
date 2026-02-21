require('dotenv').config();
const mongoose = require('mongoose');
const { startServer } = require('./src/api/server');
const { startBot } = require('./src/bot/bot');
const { startCron, checkPrices } = require('./src/api/services/cronService');

async function init() {
   await mongoose.connect(process.env.MONGODB_URL);
   console.log('DB conected');

   startServer(process.env.PORT || 3000);
   startBot();
   startCron();

}
init()