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
    this.use(Composer.acl(this.isGroup.bind(this), Message));
  }

  async isGroup(context, next) {
    if (context.message && context.message.chat.type !== 'private') {
      if (!(await this.applicableFilterUser(context))) {
        return true;
      }
      return false;
    }
    return false;
  }

  async applicableFilterUser(context) {
    const utilRunner = await UserLevelByGroupService.run({
      context,
    });
    return utilRunner;
  }
}

export default new Group();
