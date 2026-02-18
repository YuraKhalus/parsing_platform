const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios')

const API_URL = 'http://localhost:3000/api'


const startBot = (token) => {
   const bot = new TelegramBot(token, { polling: true });

   const mainMenu = {
      reply_markup: {
         keyboard: [
            ['+ Нове оголошення', 'Мої оголошення']
         ],
         resize_keyboard: true
      }
   }

   bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(msg.chat.id, `Привіт, ${msg.from.first_name}! \n Виберіть дію в меню:`, mainMenu);

   })

   bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      if(!text) return;

      if (text === '+ Нове оголошення' || text === '/new') {
         return bot.sendMessage(chatId, 'Надішіть посилання на товар з сайту hotline.ua');
      }
      if (text === "Мої оголошення" || text === '/saved') {
         return bot.sendMessage(chatId, 'В роозробці');
      }

      if (text && text.includes('hotline.ua')) {
         const loading = await bot.sendMessage(chatId, 'Оброка на API...');

         try {
            const response = await axios.post(`${API_URL}/products`,{
               url: text,
               telegramId: chatId,
               username: msg.from.first_name
            });

            const product = response.data;

            bot.editMessageText(`Додано через API: \n${product.fullNameOfProduct}\n ${product.priseRange.min} грн.`, {
               chat_id: chatId,
               message_id: loading.message_id
            });

         } catch (error) {
            bot.editMessageText(`Помилка API: \n${error.message}`, {
               chat_id: chatId,
               message_id: loading.message_id
            });
         }
      }
   })

}
module.exports = {startBot}



















