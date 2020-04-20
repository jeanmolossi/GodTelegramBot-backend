import Telegraf from 'telegraf';
import Database from './database';

import Group from './app/middlewares/Group';
import Private from './app/middlewares/Private';
import InlineKeyboardListener from './app/middlewares/InlineKeyboardListener';

class GodBotController {
  constructor(token, options = null) {
    // CONNECT BOT CONTROLLER WITH DATABASE
    this.database = Database; // JUST INIT THE CONSTRUCTOR

    // STARTS NEW BOT
    this.bot = new Telegraf(token, options);
    // BOT MIDDLEWARES BEFORE START POLLING
    this.bot.use(InlineKeyboardListener);
    this.bot.use(Group);
    this.bot.use(Private);

    this.bot.startPolling();

    return this;
  }
}

export default GodBotController;
