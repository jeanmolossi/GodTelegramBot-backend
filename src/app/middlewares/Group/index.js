import Composer from 'telegraf/composer';

import UserLevelByGroupService from '../../../services/UserLevelByGroupService';

import Commands from './Commands';
import GroupListener from './GroupListener';
import Message from './Message';

class Group extends Composer {
  constructor() {
    super();

    this.use(Composer.acl(this.isGroup.bind(this), GroupListener));
    this.use(Composer.acl(this.isGroup.bind(this), Commands));
    this.use(
      Composer.acl(
        this.isGroup.bind(this) && this.applicableFilterUser.bind(this),
        Message
      )
    );
  }

  async isGroup(context, next) {
    if (context.message && context.message.chat.type !== 'private') {
      return true;
    }

    return false;
  }

  async applicableFilterUser(context) {
    const issetUserLevelByGroupService = context.appState.utils.getState(
      'UserLevelByGroupService'
    );
    if (issetUserLevelByGroupService !== undefined) {
      return !issetUserLevelByGroupService;
    }
    const utilRunner = await UserLevelByGroupService.run({
      context,
    });
    await context.appState.utils.addToState({
      UserLevelByGroupService: utilRunner,
    });
    return utilRunner;
  }
}

export default new Group();
