import User from '../../app/models/User';
import Group from '../../app/models/Group';
import Buy from '../../app/models/Buy';

class GroupMethods {
  constructor(subject) {
    this.subject = subject;

    this.subject.subscribe('updateMigrateGroup', this.updateMigrateGroup);
    this.subject.subscribe('updateTitleGroup', this.updateTitleGroup);
    this.subject.subscribe('newChat', this.findOrCreateGroup);
    this.subject.subscribe('leftChatMember', this.leftChatMember);

    return this;
  }

  async findOrCreateGroup({
    groupTgId,
    groupName = null,
    adminTgId = null,
    productId = null,
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
    console.log(chatId);
    const group = await Group.findByTgId(chatId);
    if (!group) return false;
    await group.update({ name: title });
    return true;
  }

  async findGroupByTgId(tgId) {
    const group = await Group.findByTgId(tgId);
    return group;
  }
}

export default GroupMethods;
