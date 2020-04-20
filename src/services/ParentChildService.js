import ParentChild from '../app/models/ParentChildInGroup';
import User from '../app/models/User';
import Group from '../app/models/Group';

class ParentChildService {
  async getParentRun({ groupTgId, childTgId }) {
    const parentChild = await ParentChild.findOne({
      where: {
        groupTgId: `${groupTgId}`,
        childTgId: `${childTgId}`,
      },
    });
    if (parentChild === null) return null;

    return parentChild.parentTgId;
  }

  async setParentRun({ groupTgId, childTgId, parentTgId }) {
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
}

export default new ParentChildService();
