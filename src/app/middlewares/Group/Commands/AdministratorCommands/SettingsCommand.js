import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';

export default class SettingsCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('settings', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.replyWithMarkdown(
      `Você deseja alterar as configurações do grupo ?`,
      Extra.markup((m) =>
        m.inlineKeyboard([
          [m.callbackButton('Alterar configurações', 'settingsWelcome')],
          [m.callbackButton('Cancelar', 'settingsCancel')],
        ])
      )
    );
  }
}
