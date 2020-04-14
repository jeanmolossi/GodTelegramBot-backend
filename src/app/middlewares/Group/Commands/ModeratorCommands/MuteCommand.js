import Composer from 'telegraf/composer';

export default class MuteCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('mute', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`MuteCommand Ok`);
  }
}
