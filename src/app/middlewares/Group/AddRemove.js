import Composer from 'telegraf';

import { warn } from '../../../Utils/groupUtils';

import ParentChildService from '../../../services/ParentChildService';
import UpdateGroupInfoService from '../../../services/UpdateGroupInfoService';
import FindOrCreateGroupService from '../../../services/FindOrCreateGroupService';

import FindLevelByGroupUtil from '../../../Utils/GroupMethods/FindLevelByGroupUtil';
import FullUserBuyCatalogUtil from '../../../Utils/UserMethods/FullUserBuyCatalogUtil';

import EventEmitter from '../../../store/EventEmitter';

class AddRemove extends Composer {
  constructor() {
    super();

    this.subject = EventEmitter;
    this.on('new_chat_members', this.adds.bind(this));
    return this;
  }

  async adds(context, next) {
    // console.log(context, 'ADDS CONTEXT');
    const allUser = await FindLevelByGroupUtil.run({
      tgId: context.update.message.chat.id,
      userTgId: context.update.message.from.id,
    });
    const { Users } = allUser || { Users: null };
    const { userRole } = Users !== null ? Users[0].UserGroup : 0;
    const level = userRole;
    if (level >= 5) {
      for (const member of context.update.message.new_chat_members) {
        await this.add_member_highRole.call(this, context, member);
        await this.add_bot.call(this, context, member);
        await this.add_me.call(this, context, member);
      }
    } else {
      for (const member of context.update.message.new_chat_members) {
        await this.add_member.call(this, context, member);
        await this.add_bot_member.call(this, context, member);
        await this.add_me.call(this, context, member);
      }
    }
    const chatId = context.update.message.chat.id;
    this.subject.notify('newChatMember', { chatId, context });
    return next();
  }

  async add_member(context, member) {
    if (member.is_bot) {
      return false;
    }

    const isClient = await FullUserBuyCatalogUtil.run({
      userTgId: member.id,
    });

    const { chat, from } = context.update.message;
    if (isClient === null || !isClient.Buys || isClient.Buys.length <= 0) {
      await context.reply(
        `Não identifiquei o registro de ${member.first_name}`
      );
      const until = Date.now() + 1000;
      await context.telegram.kickChatMember(chat.id, member.id, until);
      return false;
    }

    await ParentChildService.setParentRun({
      groupTgId: chat.id,
      childTgId: member.id,
      parentTgId: from.id,
    });
    await UpdateGroupInfoService.userCountGroupRun({
      groupTgId: chat.id,
      context,
    });

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

  async add_bot_member(context, member) {
    if (!(member.is_bot && !process.env.BOT_TOKEN.includes(member.id))) {
      return false;
    }

    try {
      await context.telegram.kickChatMember(context.message.chat.id, member.id);
      await context.deleteMessage();
      await context.reply(
        `Adicionou um bot ${context.message.from.first_name} ? Tá de brincation with me?`
      );
      await warn(
        context,
        context.message.from.id,
        1,
        'Adicionou um bot ao grupo'
      );
    } catch (error) {
      console.log(error);
    }
    return true;
  }

  async add_me(context, member) {
    if (!(member.is_bot && process.env.BOT_TOKEN.includes(member.id))) {
      return false;
    }
    const { id, title } = await context.message.chat;
    await FindOrCreateGroupService.run({
      groupTgId: id,
      groupName: title,
    });

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
      await ParentChildService.setParentRun({
        groupTgId: chat.id,
        childTgId: member.id,
        parentTgId: from.id,
      });
      await UpdateGroupInfoService.userCountGroupRun({
        groupTgId: chat.id,
        context,
      });
    } catch (error) {
      console.log(error);
    }

    return true;
  }
}

export default new AddRemove();
