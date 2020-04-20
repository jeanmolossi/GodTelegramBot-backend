import Group from '../../app/models/Group';
import User from '../../app/models/User';

class GroupStaffUtil {
  async run({ tgId }) {
    const group = await Group.findOne({
      where: { tgId: `${tgId}` },
      include: [{ model: User }],
    });
    const users = group.Users.filter(
      (user) => user && user.UserGroup.userRole >= 3
    );
    return users;
  }
}

export default new GroupStaffUtil();
