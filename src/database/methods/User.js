import EventEmitter from '../../store/EventEmitter';

import UpdateUserService from '../../services/UpdateUserService';

import infoCommandUtil from '../../Utils/UserMethods/InfoCommandUtil';

class UserMethods {
  constructor() {
    this.subject = EventEmitter;

    this.subject.subscribe('infoCommand', this.infoCommand.bind(this));
    this.subject.subscribe('updateUserRole', this.updateUserRole.bind(this));
    return this;
  }

  /**
   * METHODS FOR DEFAULT USERS
   */

  async infoCommand(payload) {
    const infoCommandRunner = await infoCommandUtil.run(payload);
    return infoCommandRunner;
  }

  async updateUserRole(payload) {
    const service = await UpdateUserService.updateUserRole(payload);
    return service;
  }
}

export default new UserMethods();
