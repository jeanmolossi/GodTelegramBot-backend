import User from '../../app/models/User';

class UserLevelUtil {
  async run({ userTgId }) {
    const level = await User.findOne({
      where: { tgId: `${userTgId}` },
      attributes: ['level'],
    });
    if (!level) return false;
    return level;
  }
}

export default new UserLevelUtil();
