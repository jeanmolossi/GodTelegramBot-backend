import Composer from 'telegraf/composer';

export default class SettingsCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('settings', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`SettingsCommand Ok`);
  }
}
