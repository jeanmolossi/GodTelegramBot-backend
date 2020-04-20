import Composer from 'telegraf/composer';

import FindLevelByGroupUtil from '../../../../Utils/GroupMethods/FindLevelByGroupUtil';

import MemberCommands from './MemberCommands';
import HelperCommands from './HelperCommands';
import SubModeratorCommands from './SubModeratorCommands';
import ModeratorCommands from './ModeratorCommands';
import AdministratorCommands from './AdministratorCommands';
import CoFounderCommands from './CoFounderCommands';
import FounderCommands from './FounderCommands';
import DevCommands from './DevCommands';

class Commands extends Composer {
  constructor() {
    super();

    this.levelRole = {
      Default_User: 1,
      Livre: 2,
      Helper: 3,
      SubModerator: 4,
      Moderator: 5,
      Administrator: 6,
      CoFounder: 7,
      Founder: 8,
      Dev: 99,
    };

    this.payload = {};

    this.use(Composer.acl(this.useDevCommands.bind(this), DevCommands));
    this.use(Composer.acl(this.useFounderCommands.bind(this), FounderCommands));
    this.use(
      Composer.acl(this.useCoFounderCommands.bind(this), CoFounderCommands)
    );
    this.use(
      Composer.acl(
        this.useAdministratorCommands.bind(this),
        AdministratorCommands
      )
    );
    this.use(
      Composer.acl(this.useModeratorCommands.bind(this), ModeratorCommands)
    );
    this.use(
      Composer.acl(
        this.useSubModeratorCommands.bind(this),
        SubModeratorCommands
      )
    );
    this.use(Composer.acl(this.useHelperCommands.bind(this), HelperCommands));
    this.use(Composer.acl(this.useMemberCommands.bind(this), MemberCommands));
  }

  /**
   * @param { LEVEL }
   * 1 - Default User
   * 2 - Livre
   * 3 - Helper
   * 4 - SubModerador
   * 5 - Moderador
   * 6 - Administrador
   * 7 - SubDono
   * 8 - Dono
   * 99 - DEV
   */

  async useMemberCommands() {
    return true;
  }

  async useHelperCommands() {
    const { level } = this.payload;
    return !!(level >= this.levelRole.Helper && level < this.levelRole.Dev);
  }

  async useSubModeratorCommands() {
    const { level } = this.payload;
    return !!(
      level >= this.levelRole.SubModerator && level < this.levelRole.Dev
    );
  }

  async useModeratorCommands() {
    const { level } = this.payload;
    return !!(level >= this.levelRole.Moderator && level < this.levelRole.Dev);
  }

  async useAdministratorCommands() {
    const { level } = this.payload;
    return !!(
      level >= this.levelRole.Administrator && level < this.levelRole.Dev
    );
  }

  async useCoFounderCommands() {
    const { level } = this.payload;
    return !!(level >= this.levelRole.CoFounder && level < this.levelRole.Dev);
  }

  async useFounderCommands(context, next) {
    const allUser = await FindLevelByGroupUtil.run({
      tgId: context.message.chat.id,
      userTgId: context.message.from.id,
    });

    if (allUser === null) return false;
    const { Users } = allUser;
    const { userRole } = Users[0].UserGroup;
    const level = userRole;
    this.payload.level = level;
    return !!(level >= this.levelRole.Founder && level < this.levelRole.Dev);
  }

  async useDevCommands(context, next) {
    return context.message.from.id === process.env.BOT_DEV_ID;
  }
}

export default new Commands();
