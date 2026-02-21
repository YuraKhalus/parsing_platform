const cron = require('node-cron');
const Product = require('../models/Product');
const User = require('../models/User');
const { runParser } = require('./parser');
// const { bot } = require('../../bot/bot');

async function checkPrices(){
   console.log("Check prices");
   try{
      const products = await Product.find({});
      // console.log(products);

      for(const product of products){
         console.log("Check " + product.fullNameOfProduct);

         const newData = await runParser(product.url);
         const newPrice = newData.priseRange.min;
         const oldPrice = product.priseRange.min;

         if(newPrice !== oldPrice){
            product.priseHistory.push({
               prise: newPrice,
               date: product.lastParsed
            });
            product.priseRange.min = newPrice;
            product.lastParsed = new Date();
            await product.save();

            const usersToNotify = User.find({
               savedProducts: product._id
            })
         
            const trend = newPrice < oldPrice ? "ЗНИЗИЛАСЬ" : "ЗРОСЛА";

            const message = `
             Увага! Ціна ${tend} \n
             Назва: ${product.fullNameOfProduct} \n
             Стара ціна: ${oldPrice} \n
             Нова ціна: ${newPrice} \n
             [Переглянути на hotline](${product.url}) \n
            `;

            for(const user of usersToNotify){
               bot.sendMessage(user.telegramId, message, {parse_mode: 'Markdown'})
                  .catch(err => console.log('Не вадалось надіслати повідомлення, користувачу ' + user.telegramId + ": " + err));
            }

         }
      }

      console.log("Prices checked");

   }catch(err){
      console.log("Помилка підчас первірки цін:",  err);
   }
  
}

const startCron = () => {
   cron.schedule('0 10 * * *', checkPrices);
}

module.exports = { startCron, checkPrices }