import Composer from 'telegraf';

import { warn } from '../../../../Utils/groupUtils';

import RuleMethods from '../../../../database/methods/Rule';

class FloodMessage extends Composer {
  constructor() {
    super();

    this.floods = {};
    this.use(this.messageFilter.bind(this));
  }

  async messageFilter(context, next) {
    console.log(this.floods);
    if (!context.message) return next();
    const hasRule = await RuleMethods.hasThatRule(
      context.message.chat.id,
      'DENY_FLOOD'
    );
    if (!hasRule) {
      return next();
    }

    if (this.is_flood.call(this, context)) {
      this.floods[context.message.from.id] = {
        from: context.message.from.id,
        date: Date.now(),
        count: this.floods[context.message.from.id].count + 1,
      };
    } else {
      this.floods[context.message.from.id] = {
        from: context.message.from.id,
        date: Date.now(),
        count: 1,
      };
    }

    if (this.floods[context.message.from.id].count < 10) {
      return next();
    }

    const newPermissions = {
      can_send_messages: false,
      can_send_media_messages: false,
      can_send_polls: false,
      can_send_other_messages: false,
      can_add_web_page_previews: false,
      can_change_info: false,
      can_invite_users: false,
      can_pin_messages: false,
    };

    const untilDate = Date.now() + 1000 * 60 * 60 * 24; // 1day

    if (context.message.chat.type === 'supergroup') {
      try {
        context.telegram.restrictChatMember(
          context.message.chat.id,
          context.message.from.id,
          newPermissions,
          untilDate
        );
      } catch (e) {
        await context.reply(
          `Não tenho autorização, senão teria bloqueado você!`
        );
      }
    }

    if (
      this.floods[context.message.from.id].count === 10 ||
      this.floods[context.message.from.id].count >= 17
    ) {
      await warn(context, context.message.from.id, 1, 'Floodando Chat');
    }
    return next();
  }

  is_flood(context) {
    const isFlood =
      context.message.from.id in this.floods &&
      this.floods[context.message.from.id].from.toString() ===
        context.message.from.id.toString() &&
      Date.now() - this.floods[context.message.from.id].date < 3000;

    console.log(isFlood);
    return isFlood;
  }
}

export default new FloodMessage();
