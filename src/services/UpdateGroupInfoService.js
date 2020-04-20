import Group from '../app/models/Group';

class UpdateGroupInfoService {
  async migrateGroupRun({ oldTgId, newTgId, name = null }) {
    const group = await Group.findByTgId(oldTgId);
    if (!group) return false;
    await group.update({ tgId: `${newTgId}`, oldTgId: `${oldTgId}`, name });
    return true;
  }

  async titleGroupRun({ chatId, title }) {
    // console.log(chatId);
    const group = await Group.findByTgId(chatId);
    if (!group) return false;
    await group.update({ name: title });
    return true;
  }

  async userCountGroupRun({ groupTgId, context }) {
    try {
      const group = await Group.findOne({ where: { tgId: `${groupTgId}` } });
      if (!group) {
        return false;
      }
      const chatCount =
        (await context.telegram.getChatMembersCount(groupTgId)) - 1;

      await group.update({ userCount: chatCount });
    } catch (error) {
      console.log(error);
    }
    return true;
  }
}

export default new UpdateGroupInfoService();
