import Composer from 'telegraf/composer';

export default class StartCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('staff', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    const { chat } = context.message;
    const groupStaff = await this.database.groupMethods.findGroupStaff(chat.id);
    const staff = groupStaff.map((userStaff) => {
      let role = 'Defaul User';
      switch (userStaff.UserGroup.userRole) {
        case 3:
          role = 'Helper';
          break;
        case 4:
          role = 'SubModerador';
          break;
        case 5:
          role = 'Moderador';
          break;
        case 6:
          role = 'Administrador';
          break;
        case 7:
          role = 'CoFundador';
          break;
        case 8:
          role = 'Fundador';
          break;
        default:
          break;
      }
      return `*${role}*\n[${userStaff.name}](tg://user?id=${userStaff.tgId})`;
    });
    if (staff.join('\n') !== '')
      await context.replyWithMarkdown(staff.join('\n\n'));
  }
}
