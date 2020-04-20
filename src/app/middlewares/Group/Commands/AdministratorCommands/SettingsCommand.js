import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';

class SettingsCommand extends Composer {
  constructor() {
    super();
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

export default new SettingsCommand();
