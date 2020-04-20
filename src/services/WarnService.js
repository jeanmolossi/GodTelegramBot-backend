import Group from '../app/models/Group';
import User from '../app/models/User';

class WarnService {
  async getWarnsRun({ groupTgId, userTgId }) {
    const group = await Group.findOne({
      where: { tgId: `${groupTgId}` },
      include: [{ model: User, where: { tgId: `${userTgId}` } }],
    });

    if (group && group.Users[0] !== undefined) {
      return group.Users[0].UserGroup.warnsNumber;
    }

    return false;
  }

  async getAllWarnsRun({ userTgId }) {
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

  async setWarnsRun({ groupTgId, userTgId, warnsNum, name = null }) {
    const group = await Group.findByTgId(groupTgId);
    const user = await User.findOrCreateByTgId(userTgId, name);

    await group.addUser(user, {
      through: { warnsNumber: warnsNum },
    });
  }
}
export default new WarnService();
