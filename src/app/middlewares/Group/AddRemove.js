import Composer from 'telegraf';

export default class AddRemove extends Composer {
  constructor(database, subject) {
    super();

    this.subject = subject;
    this.database = database;
    this.on('new_chat_members', this.adds.bind(this));
    return this;
  }

  async adds(context, next) {
    // console.log(context, 'ADDS CONTEXT');
    const allUser = await this.database.groupMethods.findLevelUserByGroup(
      context.update.message.chat.id,
      context.update.message.from.id
    );
    const { Users } = allUser || { Users: null };
    const { userRole } = Users !== null ? Users[0].UserGroup : 0;
    const level = userRole;
    if (level >= 5) {
      for (const member of context.update.message.new_chat_members) {
        await this.add_member_highRole.call(this, context, member);
        await this.add_bot_highRole.call(this, context, member);
        await this.add_me_highRole.call(this, context, member);
      }
    } else {
      for (const member of context.update.message.new_chat_members) {
        await this.add_member.call(this, context, member);
        await this.add_bot.call(this, context, member);
        await this.add_me.call(this, context, member);
      }
    }
    return next();
  }

  async add_member(context, member) {
    if (member.is_bot) {
      return false;
    }

    const isClient = await this.database.userMethods.findUserCompleteByTgId(
      member.id
    );
    const { chat, from } = context.update.message;
    if (!isClient.Buys || isClient.Buys.length <= 0 || isClient.Buys === null) {
      await context.reply(
        `Não identifiquei o registro de ${member.first_name}`
      );
      const until = Date.now() + 1000;
      await context.telegram.kickChatMember(chat.id, member.id, until);
      return false;
    }

    await this.database.warnMethods.setParent(chat.id, member.id, from.id);
    await this.database.groupMethods.updateGroupUserCount(chat.id, context);

    return true;
  }

  async add_bot(context, member) {
    if (!(member.is_bot && !process.env.BOT_TOKEN.includes(member.id))) {
      return false;
    }

    await context.deleteMessage();
    await context.reply(
      `Adicionou outro bot ${context.message.from.first_name} ? Você está me trocando?`
    );
    return true;
  }

  async add_me(context, member) {
    if (!(member.is_bot && process.env.BOT_TOKEN.includes(member.id))) {
      return false;
    }
    const { id, title } = await context.message.chat;
    await this.database.groupMethods.findOrCreateGroup(id, title);

    await context.replyWithMarkdown(`
Obrigado amigo! [@${context.message.from.first_name}](tg://user?id=${context.message.from.id})!
Você sempre foi o melhor!
    `);

    const { permissions } = await context.telegram.getChat(id);
    if (
      permissions.can_change_info === true ||
      permissions.can_invite_users === true ||
      permissions.can_pin_messages === true ||
      permissions.can_add_web_page_previews === true
    ) {
      await context.replyWithMarkdown(
        `Lembre-se de mudar as _permissões_ de usuários do grupo\n` +
          `Todos estão podendo *invitar usuários* e *mudar a info* do grupo`
      );
    }
    return true;
  }

  /**
   * @param HIGHROLESADD
   */

  async add_member_highRole(context, member) {
    if (member.is_bot) {
      return false;
    }
    const { chat, from } = context.update.message;
    try {
      await this.database.warnMethods.setParent(chat.id, member.id, from.id);
      await this.database.groupMethods.updateGroupUserCount(chat.id, context);
    } catch (error) {
      console.log(error);
    }

    return true;
  }

  async add_bot_highRole(context, member) {
    if (!(member.is_bot && !process.env.BOT_TOKEN.includes(member.id))) {
      return false;
    }

    await context.deleteMessage();
    await context.reply(
      `Adicionou outro bot ${context.message.from.first_name} ? Você está me trocando?`
    );
    return true;
  }

  async add_me_highRole(context, member) {
    if (!(member.is_bot && process.env.BOT_TOKEN.includes(member.id))) {
      return false;
    }
    const { id, title } = await context.message.chat;
    await this.database.groupMethods.findOrCreateGroup(id, title);

    await context.replyWithMarkdown(`
Obrigado amigo! [@${context.message.from.first_name}](tg://user?id=${context.message.from.id})!
Você sempre foi o melhor!
    `);

    const { permissions } = await context.telegram.getChat(id);
    if (
      permissions.can_change_info === true ||
      permissions.can_invite_users === true ||
      permissions.can_pin_messages === true ||
      permissions.can_add_web_page_previews === true
    ) {
      await context.replyWithMarkdown(
        `Lembre-se de mudar as _permissões_ de usuários do grupo\n` +
          `Todos estão podendo *invitar usuários* e *mudar a info* do grupo`
      );
    }
    return true;
  }
}
