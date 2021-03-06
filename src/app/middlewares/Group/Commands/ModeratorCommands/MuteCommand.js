import Composer from 'telegraf/composer';

import {} from 'date-fns';

class MuteCommand extends Composer {
  constructor() {
    super();
    this.command('mute', this.commandAction.bind(this));
    this.command('unmute', this.commandOppositeAction.bind(this));
  }

  async commandAction(context, next) {
    try {
      const { message } = context.update;
      if (!('reply_to_message' in message)) {
        return next();
      }
      if (message.chat.type === 'supergroup') {
        let timeCalc = parseInt(
          message.text.replace(/^\/mute@?[0-9]* /, ''),
          10
        );
        if (Number.isNaN(timeCalc)) timeCalc = 24 * 60;
        const toTime = 60 * timeCalc;
        const until_date = Math.floor(new Date().getTime() / 1000) + toTime;
        const permissions = {
          can_send_messages: false,
          can_change_info: false,
          can_invite_users: false,
          can_pin_messages: false,
        };
        await context.telegram.restrictChatMember(
          message.reply_to_message.chat.id,
          message.reply_to_message.from.id,
          {
            permissions,
            until_date,
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
    return next();
  }

  async commandOppositeAction(context, next) {
    const { message } = context.update;
    try {
      if (!('reply_to_message' in message)) {
        return next();
      }
      const { permissions, type } = await context.telegram.getChat(
        message.chat.id
      );

      if (type === 'supergroup') {
        await context.telegram.restrictChatMember(
          message.chat.id,
          message.reply_to_message.from.id,
          permissions
        );
      }
    } catch (error) {
      console.log(error);
    }
    return next();
  }
}

export default new MuteCommand();
