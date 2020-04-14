import Composer from 'telegraf';

export default class GroupListener extends Composer {
  constructor(database, subject) {
    super();
    this.subject = subject;
    this.database = database;

    this.on('group_chat_created', this.newChat.bind(this));
    this.on('migrate_from_chat_id', this.migrate.bind(this));
    this.on('message', this.messageListener.bind(this));
  }

  async migrate(context, next) {
    const { migrate_from_chat_id } = await context.message;
    const { id, title } = await context.message.chat;
    await this.subject.notify('updateMigrateGroup', {
      oldTgId: migrate_from_chat_id,
      newTgId: id,
      name: title,
    });
    await context.reply(`Antigo grupo atualizou para um novo Supergrupo!`);
  }

  async messageListener(context, next) {
    console.log(context.message);
    const { new_chat_title, left_chat_member, chat } = await context.message;
    if (new_chat_title) {
      this.subject.notify('updateTitleGroup', {
        chatId: chat.id,
        title: new_chat_title,
      });
      return next();
    }
    if (left_chat_member) {
      this.subject.notify('leftChatMember', {
        chatId: chat.id,
        userTgId: left_chat_member.id,
      });
      return next();
    }
    return true;
  }

  async newChat(context, next) {
    if (!('group_chat_created' in context.message)) return next();
    const { chat, from } = context.message;

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
    return next();
  }
}
