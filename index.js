const TelegramBot = require('node-telegram-bot-api');

const { token } = require('./config.json');

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  const options = {
    reply_markup: {
      remove_keyboard: true,
    },
  };

  bot.sendMessage(chatId, resp, options);
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const options = {
    reply_markup: {
      keyboard: [['Claim Daily Reward']],
      remove_keyboard: true,
    },
  };

  bot.sendMessage(chatId, 'Welcome', options);
});

bot.onText(/Claim\sDaily\sReward/, (msg) => {
  const chatId = msg.chat.id;
  const options = {
    reply_markup: {
      remove_keyboard: true,
    },
  };

  bot.sendMessage(chatId, 'Claim', options);
});

bot.onText(/\/sendpic/, (msg) => {
  const chatId = msg.chat.id;
  const options = {
    reply_markup: {
      remove_keyboard: true,
    },
  };

  bot.sendPhoto(
    chatId,
    'https://miro.medium.com/max/1400/1*dnbk_d4BSiIJ8ZRdfog8jg.jpeg',
    options
  );
});

bot.onText(/\/poll/, (msg) => {
  const chatId = msg.chat.id;
  const options = {
    reply_markup: {
      remove_keyboard: true,
    },
  };

  bot.sendPoll(chatId, 'Is Telegram great?', ['Sure', 'Of course'], options);
});
