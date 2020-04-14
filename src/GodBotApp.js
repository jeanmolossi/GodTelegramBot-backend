import Telegraf from 'telegraf';
import EventEmitter from './store/EventEmitter';
import Database from './database';

import Group from './app/middlewares/Group';
import Private from './app/middlewares/Private';
import UpdatesListener from './app/middlewares/UpdatesListener';

class GodBotController extends EventEmitter {
  constructor(token, options = null) {
    super();
    // MAKE THIS CONTROLLER AS SUBJECT TO OBSERVER
    this.subject = new EventEmitter();
    // CONNECT BOT CONTROLLER WITH DATABASE
    this.database = new Database(this.subject);

    // STARTS NEW BOT
    this.bot = new Telegraf(token, options);
    // BOT MIDDLEWARES BEFORE START POLLING
    this.bot.use(new UpdatesListener(this.database, this.subject));
    this.bot.use(new Group(this.database, this.subject));
    this.bot.use(new Private(this.database, this.subject));

    this.bot.startPolling();

    return this;
  }
}

export default GodBotController;
