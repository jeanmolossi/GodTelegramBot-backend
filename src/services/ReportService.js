import ParentChild from '../app/models/ParentChildInGroup';
import User from '../app/models/User';
import UserGroup from '../app/models/UserGroup';

import UpdateGroupInfoService from './UpdateGroupInfoService';
import GroupManagerController from '../app/controllers/GroupManagerController';

class ReportService {
  async leftChatMemberRun({ chatId, userTgId, context }) {
    const hasParent = await ParentChild.findOne({
      where: {
        groupTgId: `${chatId}`,
        childTgId: `${userTgId}`,
      },
    });
    await UpdateGroupInfoService.userCountGroupRun({ chatId, context });
    await GroupManagerController.decrementUser(chatId, context);
    const user = await User.findByTgId(userTgId);
    if (user) {
      await UserGroup.destroy({ where: { UserId: user.id } });
      if (hasParent) {
        await ParentChild.destroy({
          where: {
            childTgId: `${userTgId}`,
            groupTgId: `${chatId}`,
          },
        });
      }
    }
    return true;
  }

  async newChatMemberRun({ chatId, context }) {
    await GroupManagerController.incrementUser(chatId, context);
    return true;
  }
}

export default new ReportService();
