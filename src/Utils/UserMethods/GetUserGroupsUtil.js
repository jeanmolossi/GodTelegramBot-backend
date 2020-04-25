import User from '../../app/models/User';

class GetUserGroupsUtil {
  async run({ userTgId }) {
    const user = await User.findByTgId(userTgId);
    const userGroups = await user.getGroups();

    if (userGroups && userGroups.length > 0) return userGroups;

    return null;
  }
}
export default new GetUserGroupsUtil();
