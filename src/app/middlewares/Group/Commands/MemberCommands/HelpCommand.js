import Composer from 'telegraf/composer';
import Markup from 'telegraf/markup';

export default class HelpCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('help', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    const { Users } = await this.database.groupMethods.findLevelUserByGroup(
      context.message.chat.id,
      context.message.from.id
    );
    const { userRole } = Users[0].UserGroup;
    await context.reply(`Vem de PV ;)`);
    if (userRole >= 3) {
      await this.userHelper(context);
    }
    if (userRole >= 4) {
      await this.userSubModerator(context);
    }
    if (userRole >= 5) {
      await this.userModerator(context);
    }
  }

  async userHelper(context) {
    await context.telegram.sendMessage(
      context.message.from.id,
      `Você pode usar as funções de Helper\n/del\n/logdel`,
      {
        reply_markup: Markup.inlineKeyboard([
          [Markup.callbackButton('Como funciona /del ?', 'howWorkDel')],
          [Markup.callbackButton('Como funciona /logdel ?', 'howWorkLogDel')],
        ]),
      }
    );
  }

  async userSubModerator(context) {
    await context.telegram.sendMessage(
      context.message.from.id,
      `Você pode usar as funções de SubModerador\n/warn\n/unwarn`,
      {
        reply_markup: Markup.inlineKeyboard([
          [Markup.callbackButton('Como funciona /warn ?', 'howWorkWarn')],
          [Markup.callbackButton('Como funciona /unwarn ?', 'howWorkUnwarn')],
        ]),
      }
    );
  }

  async userModerator(context) {
    await context.telegram.sendMessage(
      context.message.from.id,
      `Você pode usar as funções de Moderador\n/mute\n/notificacoes\n/info`,
      {
        reply_markup: Markup.inlineKeyboard([
          [Markup.callbackButton('Como funciona /mute ?', 'howWorkMute')],
          [
            Markup.callbackButton(
              'Como funciona /notificacoes ?',
              'howWorkNotification'
            ),
          ],
          [Markup.callbackButton('Como funciona /info ?', 'howWorkInfo')],
        ]),
      }
    );
  }
}
