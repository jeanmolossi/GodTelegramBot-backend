import Composer from 'telegraf/composer';

export default class GroupLinkCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('grouplink', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`GroupLinkCommand Ok`);
  }
}
