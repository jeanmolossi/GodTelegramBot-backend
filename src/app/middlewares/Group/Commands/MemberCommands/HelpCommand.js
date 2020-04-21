import Composer from 'telegraf/composer';
import Markup from 'telegraf/markup';
import Extra from 'telegraf/extra';

import FindLevelByGroupUtil from '../../../../../Utils/GroupMethods/FindLevelByGroupUtil';
import SimpleFindUserByTgId from '../../../../../Utils/UserMethods/SimpleFindUserByTgId';

class HelpCommand extends Composer {
  constructor() {
    super();
    this.command('help', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    let allUser = null;
    let Users = null;
    const { chat, from } = context.message;

    allUser = await FindLevelByGroupUtil.run({
      tgId: chat.id,
      userTgId: from.id,
    });

    if (allUser === null) {
      Users = [
        await SimpleFindUserByTgId.run({
          userTgId: from.id,
        }),
      ];
    } else {
      Users = allUser.Users;
    }

    if (Users === null || Users.length <= 0 || Users[0].UserGroup === undefined)
      return next();

    const { userRole } = Users[0].UserGroup;
    await context.reply(
      `Vem de PV ;)`,
      Extra.markup((m) =>
        m
          .keyboard([['/help', '/staff']])
          .oneTime()
          .resize()
      )
    );
    if (userRole >= 3) {
      await this.userHelper(context);
    }
    if (userRole >= 4) {
      await this.userSubModerator(context);
    }
    if (userRole >= 5) {
      await this.userModerator(context);
    }
    if (userRole >= 6) {
      await this.userAdministrator(context);
    }
    return next();
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

  async userAdministrator(context) {
    await context.telegram.sendMessage(
      context.message.from.id,
      `Você pode usar as funções de Administrator\n` +
        `/settings\n/reload\n/ban\n/unban\n/kick`,
      {
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.callbackButton(
              'Como funciona o /settings ?',
              'howWorkSettings'
            ),
          ],
          [Markup.callbackButton('Como funciona o /ban ?', 'howWorkBan')],
          [Markup.callbackButton('Como funciona o /unban ?', 'howWorkUnban')],
          [Markup.callbackButton('Como funciona o /kick ?', 'howWorkKick')],
        ]),
      }
    );
  }
}

export default new HelpCommand();
