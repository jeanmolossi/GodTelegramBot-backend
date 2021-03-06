import Composer from 'telegraf/composer';
import Markup from 'telegraf/markup';
import Extra from 'telegraf/extra';

import FindLevelByGroupUtil from '../../../../../Utils/GroupMethods/FindLevelByGroupUtil';
import SimpleFindUserByTgId from '../../../../../Utils/UserMethods/SimpleFindUserByTgId';

class HelpCommand extends Composer {
  constructor() {
    super();
    this.command('help', this.answerForHelp.bind(this));
  }

  async answerForHelp(context, next) {
    await context.reply(`Vem no PV ;)`);
    await context.telegram.sendMessage(
      context.message.from.id,
      `Utilize aqui o /help que te conto mais... ;D`
    );
    return next();
  }

  async commandAction(context, next) {
    let allUser = null;
    let Users = null;
    const { chat, from } = context.message;

    const issetFindLevelByGroupUtil = context.appState.utils.getState(
      'FindLevelByGroupUtil'
    );

    if (issetFindLevelByGroupUtil) {
      allUser = issetFindLevelByGroupUtil;
      console.log('issetFindLevelByGroupUtil FOUND! RETURNING THIS');
    } else {
      allUser = await FindLevelByGroupUtil.run({
        tgId: chat.id,
        userTgId: from.id,
      });
      context.appState.utils.addToState({
        FindLevelByGroupUtil: allUser.dataValues,
      });
      console.log('FindLevelByGroupUtil IS NOT FOUND! SETTING THIS');
    }

    if (allUser === null) {
      const issetSimpleFindUserByTgId = context.appState.utils.getState(
        'SimpleFindUserByTgId'
      );
      if (issetSimpleFindUserByTgId) {
        Users = issetSimpleFindUserByTgId;
      } else {
        Users = [
          await SimpleFindUserByTgId.run({
            userTgId: from.id,
          }),
        ];
        context.appState.utils.addToState({
          SimpleFindUserByTgId: Users,
        });
      }
    } else {
      Users = allUser.Users;
    }

    if (Users === null || Users.length <= 0 || Users[0].UserGroup === undefined)
      return next();

    const { userRole } = Users[0].UserGroup;
    await context.reply(
      `Vem de PV ;)`,
      Extra.markup(m =>
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
