import User from '../../app/models/User';
import Group from '../../app/models/Group';
import UserGroup from '../../app/models/UserGroup';
import Buy from '../../app/models/Buy';
import ParentChild from '../../app/models/ParentChildInGroup';

import GroupManagerController from '../../app/controllers/GroupManagerController';

class GroupMethods {
  constructor(subject) {
    this.methods = this;
    this.subject = subject;

    this.manager = GroupManagerController;

    this.subject.subscribe(
      'updateMigrateGroup',
      this.updateMigrateGroup.bind(this)
    );
    this.subject.subscribe(
      'updateTitleGroup',
      this.updateTitleGroup.bind(this)
    );
    this.subject.subscribe('newChat', this.findOrCreateGroup.bind(this));
    this.subject.subscribe('leftChatMember', this.leftChatMember.bind(this));
    this.subject.subscribe('newChatMember', this.newChatMember.bind(this));

    return this;
  }

  async findOrCreateGroup({
    groupTgId,
    groupName = null,
    adminTgId = null,
    productId = null,
    context = null,
  }) {
    // IF HAS GROUP WITH THIS TGID - IF NO HAS CREATE THIS
    const [group, hasGroup] = await Group.findOrCreate({
      where: {
        tgId: `${groupTgId}`,
      },
    });

    if (hasGroup && group.name === null && groupName !== null) {
      await group.update({ name: groupName });
    }
    if (adminTgId !== null) {
      const admin = await User.findByTgId(adminTgId);
      // console.log(admin);
      if (admin) {
        admin.addGroup(group, { through: { userRole: 8 } });
      } else {
        return false;
      }
    }
    if (productId !== null) {
      const produto = await Buy.findByProductId(productId);
      if (produto) {
        produto.addGroup(group, { through: 'ProductGroup' });
        group.setProduct(produto);
      } else {
        return false;
      }
    }
    if (context !== null) {
      await context.reply(`✅ Configurações reinicializadas`);
    }
    return group;
  }

  async updateMigrateGroup({ oldTgId, newTgId, name = null }) {
    const group = await Group.findByTgId(oldTgId);
    if (!group) return false;
    await group.update({ tgId: `${newTgId}`, oldTgId: `${oldTgId}`, name });
    return true;
  }

  async updateTitleGroup(payload) {
    const { chatId, title } = payload;
    // console.log(chatId);
    const group = await Group.findByTgId(chatId);
    if (!group) return false;
    await group.update({ name: title });
    return true;
  }

  async updateGroupUserCount(groupTgId, context) {
    try {
      const group = await Group.findOne({ where: { tgId: `${groupTgId}` } });
      if (!group) {
        return false;
      }
      const chatCount =
        (await context.telegram.getChatMembersCount(groupTgId)) - 1;

      await group.update({ userCount: chatCount });
    } catch (error) {
      console.log(error);
    }
    return true;
  }

  async leftChatMember({ chatId, userTgId, context }) {
    const hasParent = await ParentChild.findOne({
      where: {
        groupTgId: `${chatId}`,
        childTgId: `${userTgId}`,
      },
    });
    await this.updateGroupUserCount.call(this, chatId, context);
    await this.manager.decrementUser.call(this, chatId, context);
    const user = await User.findByTgId(userTgId);
    if (user) {
      await UserGroup.destroy({ where: { UserId: user.id } });
      if (hasParent) {
        await ParentChild.destroy({
          where: {
            childTgId: `${userTgId}`,
            groupTgId: `${chatId}`,
          },
        });
      }
    }
  }

  async newChatMember({ chatId, context }) {
    await this.manager.incrementUser.call(this, chatId, context);
  }

  async findGroupByTgId(tgId) {
    const group = await Group.findByTgId(tgId);
    return group;
  }

  async findGroupStaff(tgId) {
    const group = await Group.findOne({
      where: { tgId: `${tgId}` },
      include: [{ model: User }],
    });
    const users = group.Users.filter(
      (user) => user && user.UserGroup.userRole >= 3
    );
    return users;
  }

  async findLevelUserByGroup(tgId, userTgId) {
    const group = await Group.findOne({
      where: { tgId: `${tgId}` },
      include: [
        {
          model: User,
          where: { tgId: `${userTgId}` },
        },
      ],
    });
    return group;
  }
}

export default GroupMethods;
