import Composer from 'telegraf/composer';

export default class ReloadCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('reload', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`ReloadCommand Ok`);
  }
}
