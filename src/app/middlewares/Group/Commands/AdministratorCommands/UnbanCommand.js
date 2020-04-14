import Composer from 'telegraf/composer';

export default class UnbanCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('unban', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`UnbanCommand Ok`);
  }
}
