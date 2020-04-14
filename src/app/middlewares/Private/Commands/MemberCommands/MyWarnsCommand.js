import Composer from 'telegraf/composer';

export default class MyWarnsCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('mywarns', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`MyWarnsCommand Ok`);
  }
}
