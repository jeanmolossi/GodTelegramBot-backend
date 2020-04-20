import Composer from 'telegraf/composer';

class MyWarnsCommand extends Composer {
  constructor() {
    super();
    this.command('mywarns', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`MyWarnsCommand Ok`);
  }
}

export default new MyWarnsCommand();
