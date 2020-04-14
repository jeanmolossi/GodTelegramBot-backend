import Composer from 'telegraf/composer';

export default class HelpCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('help', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`HelpCommand Ok`);
  }
}
