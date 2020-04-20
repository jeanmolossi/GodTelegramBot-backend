import Composer from 'telegraf';
import AddRemove from './AddRemove';

import EventEmitter from '../../../store/EventEmitter';

class GroupListener extends Composer {
  constructor() {
    super();
    this.subject = EventEmitter;

    this.use(AddRemove);
    this.on('group_chat_created', this.newChat.bind(this));
    this.on('migrate_from_chat_id', this.migrateGroupEvent.bind(this));
    this.on('message', this.messageListener.bind(this));
  }

  async migrateGroupEvent(context, next) {
    const { migrate_from_chat_id } = await context.message;
    const { id, title } = await context.message.chat;
    try {
      this.subject.notify('updateMigrateGroup', {
        oldTgId: migrate_from_chat_id,
        newTgId: id,
        name: title,
      });
      await context.reply(`Antigo grupo atualizou para um novo Supergrupo!`);
    } catch (error) {
      console.log(error);
    }
    return next();
  }

  async messageListener(context, next) {
    // console.log(context.message);
    const {
      new_chat_title,
      left_chat_member,
      chat,
      reply_to_message,
    } = await context.message;
    try {
      if (new_chat_title) {
        this.subject.notify('updateTitleGroup', {
          chatId: chat.id,
          title: new_chat_title,
        });
      }

      if (
        'left_chat_member' in context.message ||
        'left_chat_member' in context.update.message
      ) {
        this.subject.notify('leftChatMember', {
          chatId: chat.id,
          userTgId: left_chat_member.id,
          context,
        });
      }

      if (reply_to_message) {
        const [botText] = reply_to_message.text.split('\n');
        if (botText === 'Configuração de API') {
          const apiCode = context.message.text;
          if (!apiCode) return next();
          const userConfig = context.message.from.id;
          this.subject.notify('apiConfig', { userConfig, apiCode, context });
        }
        if (botText === 'Adicionar produto') {
          const productId = context.message.text;
          if (!productId) return next();
          const userConfig = context.message.from.id;
          this.subject.notify('productAdd', { userConfig, productId, context });
        }
      }
    } catch (error) {
      console.log(error);
    }
    return next();
  }

  async newChat(context, next) {
    if (!('group_chat_created' in context.message)) return next();
    const { chat, from } = context.message;

    try {
      this.subject.notify('newChat', {
        groupTgId: chat.id,
        groupName: chat.title,
        adminTgId: from.id,
      });
      this.subject.notify('updateUserRole', {
        userId: null,
        tgId: from.id,
        role: 8,
        groupTgId: chat.id,
      });
    } catch (error) {
      console.log(error);
    }
    return next();
  }
}

export default new GroupListener();
