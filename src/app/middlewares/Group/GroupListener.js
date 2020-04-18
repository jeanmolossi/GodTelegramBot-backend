import Composer from 'telegraf';
import AddRemove from './AddRemove';

export default class GroupListener extends Composer {
  constructor(database, subject) {
    super();
    this.subject = subject;
    this.database = database;

    this.use(new AddRemove(database, subject));
    this.on('group_chat_created', this.newChat.bind(this));
    this.on('migrate_from_chat_id', this.migrate.bind(this));
    this.on('message', this.messageListener.bind(this));
  }

  async migrate(context, next) {
    const { migrate_from_chat_id } = await context.message;
    const { id, title } = await context.message.chat;
    try {
      await this.subject.notify('updateMigrateGroup', {
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
    console.log(context.message);
    const {
      new_chat_title,
      left_chat_member,
      chat,
      reply_to_message,
    } = await context.message;
    try {
      if (new_chat_title) {
        await this.subject.notify('updateTitleGroup', {
          chatId: chat.id,
          title: new_chat_title,
        });
      }
      if (
        'left_chat_member' in context.message ||
        'left_chat_member' in context.update.message
      ) {
        await this.subject.notify('leftChatMember', {
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
      await this.subject.notify('newChat', {
        groupTgId: chat.id,
        groupName: chat.title,
        adminTgId: from.id,
      });
      await this.subject.notify('updateUserRole', {
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
