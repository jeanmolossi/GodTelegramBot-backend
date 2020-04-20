import User from '../../app/models/User';

class SimpleFindUserByTgId {
  async run({ userTgId, name = null }) {
    const user = await User.findOrCreateByTgId(userTgId, name);
    return user;
  }
}

export default new SimpleFindUserByTgId();
