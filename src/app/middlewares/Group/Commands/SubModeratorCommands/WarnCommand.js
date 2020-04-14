import Composer from 'telegraf/composer';

export default class WarnCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('warn', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`WarnCommand Ok`);
  }
}
