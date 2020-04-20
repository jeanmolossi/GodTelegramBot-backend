import User from '../app/models/User';
import Group from '../app/models/Group';
import UserGroup from '../app/models/UserGroup';

class UpdateUserService {
  async updateUserRole({ userTgId, chatTgId, roleId, context }) {
    const user = await User.findOne({
      where: { tgId: `${userTgId}` },
      include: [{ model: Group, where: { tgId: `${chatTgId}` } }],
    });
    if (!(user && user.Groups.length > 0)) {
      return false;
    }
    const ug = user.Groups[0].UserGroup;
    const dbLine = await UserGroup.findOne({
      where: { UserId: `${ug.UserId}`, GroupId: `${ug.GroupId}` },
    });

    if (!dbLine) return false;

    try {
      await dbLine.update({ userRole: `${roleId}` });
      await context.deleteMessage();
      await context.reply(
        `Ocorreu tudo bem! O usuário foi definido com a função.`
      );
      return true;
    } catch (error) {
      console.log(error);
    }
    return true;
  }

  async updateRole(userId, role) {
    const dbLine = await UserGroup.findOne({
      where: { UserId: `${userId}` },
    });
    if (!dbLine) return false;
    dbLine.update({ userRole: `${role}` });
    return true;
  }
}

export default new UpdateUserService();
