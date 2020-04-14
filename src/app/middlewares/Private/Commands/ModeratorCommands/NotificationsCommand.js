import Composer from 'telegraf/composer';

export default class NotificationsCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('notifications', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`NotificationsCommand Ok`);
  }
}
