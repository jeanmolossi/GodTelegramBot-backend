import { Op } from 'sequelize';
import { subDays, startOfDay } from 'date-fns';

import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';
import Markup from 'telegraf/markup';

import User from '../../../../models/User';
import Notification from '../../../../models/Notification';

class NotificationCommand extends Composer {
  constructor() {
    super();

    this.command('notificacoes', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    if (!context.update.message) return next();

    const { chat } = context.update.message;
    const user = await User.findByTgId(chat.id); // PRIVATE CHAT
    if (!user) return next();

    const last3days = startOfDay(subDays(new Date().getTime(), 3));

    const notifications = await Notification.findAll({
      where: {
        toId: `${user.id}`,
        read: false,
        createdAt: {
          [Op.gte]: last3days,
        },
      },
      include: [
        {
          model: User,
          as: 'from',
        },
      ],
    });

    if (notifications.length <= 0) {
      await context.reply(`Você não possui notificações`);
      return next();
    }

    let notificationMarker = 0;
    const buttons = [];
    const notificationsList = notifications.map((notification) => {
      notificationMarker += 1;
      const notificationUrl = `${process.env.PANEL_URL}/${notification.id}/static/notification/read`;
      buttons.push([
        Markup.urlButton(
          `Ver notificação ${notificationMarker}`,
          `${notificationUrl}`
        ),
      ]);
      return (
        `Notificação ${notificationMarker}\nUsuário ref: [${notification.from.name}]` +
        `(tg://user?id=${notification.from.tgId})\n${notification.excerpt}\nO Usuário ` +
        `solicitou suporte via ${notification.method}`
      );
    });
    await context.replyWithMarkdown(
      `Suas notificações *Não lidas* dos últimos *3 dias*\n\n` +
        `${notificationsList.join('\n\n\n')}`,
      Extra.markup((m) =>
        m.inlineKeyboard(
          buttons !== null
            ? buttons
            : [m.urlButton('Ver painel', `${process.env.PANEL_URL}`)]
        )
      )
    );
    return next();
  }
}

export default new NotificationCommand();
