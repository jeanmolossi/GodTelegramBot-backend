import Composer from 'telegraf/composer';

export default class DelCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('del', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`DelCommand Ok`);
  }
}
