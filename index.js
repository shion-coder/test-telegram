const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const { token } = require('./config.json');

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(8000);

const URLLabels = [];
let tempSiteURL = '';

bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  const options = {
    parse_mode: 'HTML',
    reply_markup: {
      keyboard: [['Claim Daily Reward']],
      remove_keyboard: true,
    },
  };

  console.log('msg', msg);
  console.log('match', match);

  bot.sendMessage(
    chatId,
    `
    Welcome at <b>Telegram Bot</b>, thank you for using my service

    Available commands:

    /echo <b>Text</b> - Echo
    `,
    options
  );
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

bot.onText(/\/keyboard/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Alternative keybaord layout', {
    reply_markup: {
      keyboard: [['Sample text', 'Second sample'], ['Keyboard'], ["I'm robot"]],
      resize_keyboard: true,
      one_time_keyboard: true,
      force_reply: true,
    },
  });
});

bot.onText(/\/label/, (msg, match) => {
  const chatId = msg.chat.id;
  const url = match.input.split(' ')[1];

  if (url === undefined) {
    bot.sendMessage(chatId, 'Please provide URL of article!');

    return;
  }

  tempSiteURL = url;
  bot.sendMessage(chatId, 'URL has been successfully saved!', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Development',
            callback_data: 'development',
          },
          {
            text: 'Lifestyle',
            callback_data: 'lifestyle',
          },
          {
            text: 'Other',
            callback_data: 'other',
          },
        ],
      ],
    },
  });
});

bot.on('callback_query', (callbackQuery) => {
  console.log('callbackQuery', callbackQuery);
  const message = callbackQuery.message;
  const category = callbackQuery.data;

  URLLabels.push({
    url: tempSiteURL,
    label: category,
  });

  tempSiteURL = '';

  bot.sendMessage(
    message.chat.id,
    `URL has been labeled with category "${category}"`
  );
});

const inlineKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'YES',
          callback_data: JSON.stringify({
            command: 'mycommand1',
            answer: 'YES',
          }),
        },
        {
          text: 'NO',
          callback_data: JSON.stringify({
            command: 'mycommand1',
            answer: 'NO',
          }),
        },
      ],
    ],
  },
};

bot.onText(/\/inline/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    'You have to agree with me, OK?',
    inlineKeyboard
  );
});

const requestPhoneKeyboard = {
  reply_markup: {
    one_time_keyboard: true,
    keyboard: [
      [
        {
          text: 'My phone number',
          request_contact: true,
          one_time_keyboard: true,
        },
      ],
      ['Cancel'],
    ],
  },
};

// Listener (handler) for retrieving phone number
bot.onText(/\/phone/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    'Can we get access to your phone number?',
    requestPhoneKeyboard
  );
});
