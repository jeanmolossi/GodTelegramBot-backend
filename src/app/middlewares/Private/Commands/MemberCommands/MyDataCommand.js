import Composer from 'telegraf/composer';

class MyDataCommand extends Composer {
  constructor() {
    super();
    this.command('mydata', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`MyDataCommand Ok`);
  }
}

export default new MyDataCommand();
