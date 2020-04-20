import Composer from 'telegraf/composer';

class MyProductsCommand extends Composer {
  constructor() {
    super();
    this.command('myproducts', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`MyProductsCommand Ok`);
  }
}

export default new MyProductsCommand();
