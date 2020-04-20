import FindLevelByGroupUtil from '../Utils/GroupMethods/FindLevelByGroupUtil';

class UserLevelByGroupService {
  async run({ context }) {
    try {
      const { callback_query, message } = context.update;
      let allUser = null;
      if (callback_query !== undefined) {
        allUser = await FindLevelByGroupUtil.run({
          tgId: callback_query.message.chat.id,
          userTgId: callback_query.from.id,
        });
      } else {
        allUser = await FindLevelByGroupUtil.run({
          tgId: message.chat.id,
          userTgId: message.from.id,
        });
      }

      if (allUser === null) return false;

      const { Users } = allUser;
      const { userRole } = Users[0].UserGroup;
      if (userRole >= 6) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new UserLevelByGroupService();
