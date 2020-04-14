import Composer from 'telegraf/composer';

export default class InfoCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('info', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`InfoCommand Ok`);
  }
}
