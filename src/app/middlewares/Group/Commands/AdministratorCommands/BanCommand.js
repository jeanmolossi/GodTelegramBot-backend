import Composer from 'telegraf/composer';

export default class BanCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('ban', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`BanCommand Ok`);
  }
}
