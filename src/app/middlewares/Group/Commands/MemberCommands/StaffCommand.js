import Composer from 'telegraf/composer';

export default class StartCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('staff', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`StaffCommand Ok`);
  }
}
