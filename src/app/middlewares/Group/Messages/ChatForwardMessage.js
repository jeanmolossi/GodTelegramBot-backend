import Composer from 'telegraf';
import { warn } from '../../../../Utils/groupUtils';

import RuleMethods from '../../../../database/methods/Rule';

class ChatForwardMessage extends Composer {
  constructor() {
    super();

    this.use(this.messageFilter.bind(this));
  }

  async messageFilter(context, next) {
    if (!context.message) return next();
    const { chat, from } = context.message;
    let hasRule = false;
    const issetChatFwdhasThatRule = context.appState.utils.getState(
      'ChatFwdhasThatRule'
    );

    if (issetChatFwdhasThatRule !== undefined) {
      hasRule = issetChatFwdhasThatRule;
    } else {
      hasRule = await RuleMethods.hasThatRule(chat.id, 'DENY_CHAT_FORWARD');
      context.appState.utils.addToState({
        ChatFwdhasThatRule: hasRule,
      });
    }
    if (!hasRule) {
      return next();
    }

    if (
      !(
        ('forward_from_chat' in context.message &&
          context.message.forward_from_chat.type === 'channel') ||
        'forward_from_message_id' in context.message
      )
    ) {
      return next();
    }
    if ((await warn(context, from.id, 1, 'Encaminhando mensagens...')) > 0) {
      await context.deleteMessage();
    }
    return next();
  }
}

export default new ChatForwardMessage();
