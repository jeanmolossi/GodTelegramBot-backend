import Composer from 'telegraf/composer';

class StartCommand extends Composer {
  constructor() {
    super();
    this.command('start', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`Start Command Chamado`);
    return next();
  }
}

export default new StartCommand();
