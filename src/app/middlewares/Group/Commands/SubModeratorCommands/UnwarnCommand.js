import Composer from 'telegraf/composer';

export default class UnwarnCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('unwarn', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`UnwarnCommand Ok`);
  }
}
