import Composer from 'telegraf/composer';

export default class LogDelCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('logdel', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`LogDelCommand Ok`);
  }
}
