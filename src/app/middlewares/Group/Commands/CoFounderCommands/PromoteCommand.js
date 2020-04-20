import Composer from 'telegraf/composer';

import EventEmitter from '../../../../../store/EventEmitter';

class PromoteCommand extends Composer {
  constructor() {
    super();
    this.subject = EventEmitter;

    this.roles = [
      'null', // 0
      'defaultuser', // 1
      'freeuser', // 2
      'helper', // 3
      'submoderador', // 4
      'moderador', // 5
      'administrador', // 6
      'cofundador', // 7
      'fundador', // 8
    ];

    this.command('/administrador', this.promoteAction.bind(this));
    this.command('/cofundador', this.promoteAction.bind(this));

    this.command('/demote', this.demoteAction.bind(this));
  }

  async promoteAction(context, next) {
    const { message } = context.update;
    if (!('reply_to_message' in message)) return next();
    const { reply_to_message } = message;

    const role = message.text.replace(/\//, '');
    const roleId = this.roles.indexOf(role);

    this.subject.notify('updateUserRole', {
      userTgId: reply_to_message.from.id,
      chatTgId: message.chat.id,
      roleId,
      context,
    });

    return next();
  }

  async demoteAction(context, next) {
    const { message } = context.update;
    if (!('reply_to_message' in message)) return next();
    const { reply_to_message } = message;

    this.subject.notify('updateUserRole', {
      userTgId: reply_to_message.from.id,
      chatTgId: message.chat.id,
      roleId: 1,
      context,
    });

    return next();
  }
}

export default new PromoteCommand();
