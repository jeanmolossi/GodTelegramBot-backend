import Composer from 'telegraf/composer';

import Commands from './Commands';
import GroupListener from './GroupListener';

export default class Group extends Composer {
  constructor(database, subject) {
    super();

    this.database = database;
    this.use(
      Composer.acl(
        this.isGroup.bind(this),
        new GroupListener(database, subject)
      )
    );
    this.use(
      Composer.acl(this.isGroup.bind(this), new Commands(database, subject))
    );
  }

  async isGroup(context, next) {
    if (context.message && context.message.chat.type !== 'private') {
      return true;
    }
    return false;
  }

  async GroupListener(context, next) {}
}
