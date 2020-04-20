import Composer from 'telegraf/composer';

class NotificationsCommand extends Composer {
  constructor() {
    super();
    this.command('notifications', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`NotificationsCommand Ok`);
  }
}

export default new NotificationsCommand();
