import Composer from 'telegraf/composer';

export default class KickCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('kick', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`KickCommand Ok`);
  }
}
