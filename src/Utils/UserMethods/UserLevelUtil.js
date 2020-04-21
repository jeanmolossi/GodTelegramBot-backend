import User from '../../app/models/User';
import Group from '../../app/models/Group';

class UserLevelUtil {
  async run({ userTgId }) {
    const level = await User.findOne({
      where: { tgId: `${userTgId}` },
      attributes: ['level'],
    });
    if (!level) return false;
    return level;
  }

  async hasModerationLevel({ userTgId }) {
    const selector = await User.findOne({
      where: { tgId: `${userTgId}` },
      include: [
        {
          model: Group,
        },
      ],
    });
    let groups = null;
    if (selector && selector.Groups.length > 0) {
      groups = selector.Groups.filter(
        (gp) => gp.UserGroup && gp.UserGroup.userRole >= 5
      );
    }
    if (groups.length <= 0) return false;
    return true;
  }
}

export default new UserLevelUtil();
