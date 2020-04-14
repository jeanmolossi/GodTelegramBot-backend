import Composer from 'telegraf/composer';

export default class MyProductsCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('myproducts', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`MyProductsCommand Ok`);
  }
}
