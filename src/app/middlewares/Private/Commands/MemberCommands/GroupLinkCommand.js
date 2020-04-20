import Composer from 'telegraf/composer';

class GroupLinkCommand extends Composer {
  constructor(database) {
    super();
    this.command('grouplink', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(`GroupLinkCommand Ok`);
  }
}

export default new GroupLinkCommand();
