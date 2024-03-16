const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options.js');

const token = '6967622472:AAFFozdUAgzS0sO-JReyw5MJGO0zlCYpt14';

const bot = new TelegramApi(token, {polling: true});

bot.setMyCommands([
    {command: '/start', description: 'Начальное приветсвие'},
    {command: '/info', description: 'Вывести имя и фамилие'},
    {command: '/game', description: 'Поиграть со мной в игру (￣y▽,￣)╭ '},
])

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен будешь её отгадать');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://desu.shikimori.one/system/users/x160/1012284.png?1707406716');
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/be1/98c/be198cd5-121f-4f41-9cc0-e246df7c210d/1.webp');
            return bot.sendMessage(chatId, 'Добро пожаловать в телеграм бота');
        }
    
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, пиши правильно!');
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты угадал. Правильный ответ: ${chats[chatId]}`, againOptions);
        } else {
            bot.sendMessage(chatId, `Неправильно, бот загадал цифру: ${chats[chatId]}`, againOptions);
        }
    })
}

start();