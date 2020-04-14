import Composer from 'telegraf/composer';

export default class MyDataCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('mydata', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`MyDataCommand Ok`);
  }
}
