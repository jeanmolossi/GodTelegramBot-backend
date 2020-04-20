import Group from '../../app/models/Group';

import EventEmitter from '../../store/EventEmitter';

import GroupManagerController from '../../app/controllers/GroupManagerController';

import FindLevelByGroupUtil from '../../Utils/GroupMethods/FindLevelByGroupUtil';
import GroupStaffUtil from '../../Utils/GroupMethods/GroupStaffUtil';

import FindOrCreateGroupService from '../../services/FindOrCreateGroupService';
import UpdateGroupInfoService from '../../services/UpdateGroupInfoService';
import ReportService from '../../services/ReportService';

class GroupMethods {
  constructor() {
    this.subject = EventEmitter;

    this.manager = GroupManagerController;

    this.subject.subscribe(
      'updateMigrateGroup',
      this.updateMigrateGroup.bind(this)
    );
    this.subject.subscribe(
      'updateTitleGroup',
      this.updateTitleGroup.bind(this)
    );
    this.subject.subscribe('newChat', this.findOrCreateGroup.bind(this));
    this.subject.subscribe('leftChatMember', this.leftChatMember.bind(this));
    this.subject.subscribe('newChatMember', this.newChatMember.bind(this));

    return this;
  }

  async findOrCreateGroup(payload) {
    // IF HAS GROUP WITH THIS TGID - IF NO HAS CREATE THIS
    const group = await FindOrCreateGroupService.run(payload);
    return group;
  }

  async updateMigrateGroup(payload) {
    const migrated = await UpdateGroupInfoService.migrateGroupRun(payload);
    return migrated;
  }

  async updateTitleGroup(payload) {
    // console.log(chatId);
    const titleUpdated = await UpdateGroupInfoService.titleGroupRun(payload);
    return titleUpdated;
  }

  async updateGroupUserCount(groupTgId, context) {
    const payload = { groupTgId, context };
    const newUserCounter = await UpdateGroupInfoService.userCountGroupRun(
      payload
    );
    return newUserCounter;
  }

  async leftChatMember(payload) {
    const leftMemberCall = await ReportService.leftChatMemberRun(payload);
    return leftMemberCall;
  }

  async newChatMember(payload) {
    const newChatMemberCall = await ReportService.newChatMemberRun(payload);
    return newChatMemberCall;
  }

  async findGroupByTgId(tgId) {
    const group = await Group.findByTgId(tgId);
    return group;
  }

  async findGroupStaff(tgId) {
    const users = await GroupStaffUtil.run({ tgId });
    return users;
  }

  async findLevelUserByGroup(tgId, userTgId) {
    const group = await FindLevelByGroupUtil.run({ tgId, userTgId });
    return group;
  }
}

export default new GroupMethods();
