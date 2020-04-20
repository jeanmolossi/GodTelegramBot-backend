import Group from '../../app/models/Group';
import User from '../../app/models/User';

class FindLevelByGroupUtil {
  async run({ tgId, userTgId }) {
    const group = await Group.findOne({
      where: { tgId: `${tgId}` },
      include: [
        {
          model: User,
          where: { tgId: `${userTgId}` },
        },
      ],
    });
    if (!group || group === null) {
      return null;
    }
    return group;
  }
}

export default new FindLevelByGroupUtil();
