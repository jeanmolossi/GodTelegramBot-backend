import User from '../../app/models/User';
import Group from '../../app/models/Group';
import ParentChild from '../../app/models/ParentChildInGroup';

export default class WarnMethods {
  constructor(subject) {
    this.subject = subject;

    return this;
  }

  async getParent(groupTgId, childTgId) {
    const parentChild = await ParentChild.findOne({
      where: {
        groupTgId: `${groupTgId}`,
        childTgId: `${childTgId}`,
      },
    });
    if (parentChild === null) return null;

    return parentChild.parentTgId;
  }

  async setParent(groupTgId, childTgId, parentTgId) {
    const group = await Group.findOrCreateByTgId(groupTgId);
    const user = await User.findOrCreateByTgId(childTgId);

    await group.addUser(user, {
      through: { warnsNumber: '0' },
    });

    await ParentChild.destroy({
      where: {
        groupTgId: `${groupTgId}`,
        childTgId: `${childTgId}`,
      },
    });

    await ParentChild.create({
      groupTgId: `${groupTgId}`,
      childTgId: `${childTgId}`,
      parentTgId: `${parentTgId}`,
    });
  }

  /**
   * WARN CONFIGS TO MEMBER PUNISHMENT
   */

  async getWarns(groupTgId, userTgId) {
    const group = await Group.findOne({
      where: { tgId: `${groupTgId}` },
      include: [{ model: User, where: { tgId: `${userTgId}` } }],
    });

    if (group.Users[0] !== undefined) {
      return group.Users[0].UserGroup.warnsNumber;
    }

    return false;
  }

  async getAllWarns(userTgId) {
    const user = await User.findOne({
      where: { tgId: `${userTgId}` },
      include: [{ model: Group }],
    });

    if (!user) return false;
    const group = await user.Groups;

    if (group[0] !== undefined) {
      return group;
    }
    return false;
  }

  async setWarns(groupTgId, userTgId, warnsNum, name = null) {
    const group = await Group.findByTgId(groupTgId);
    const user = await User.findOrCreateByTgId(userTgId, name);

    await group.addUser(user, {
      through: { warnsNumber: warnsNum },
    });
  }
}
