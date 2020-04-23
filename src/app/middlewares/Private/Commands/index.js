import Composer from 'telegraf/composer';

import UserLevelUtil from '../../../../Utils/UserMethods/UserLevelUtil';

import MemberCommands from './MemberCommands';
import HelperCommands from './HelperCommands';
import ModeratorCommands from './ModeratorCommands';

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

    this.use(Composer.acl(this.useDevCommands.bind(this), HelperCommands));

    this.use(
      Composer.acl(
        this.useFounderCommands.bind(this) // HelperCommands
      )
    );
    this.use(
      Composer.acl(
        this.useCoFounderCommands.bind(this) // HelperCommands
      )
    );
    this.use(
      Composer.acl(
        this.useAdministratorCommands.bind(this) // HelperCommands
      )
    );
    this.use(
      Composer.acl(this.useModeratorCommands.bind(this), ModeratorCommands)
    );
    this.use(
      Composer.acl(
        this.useSubModeratorCommands.bind(this) // HelperCommands
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
    const { level } = this.payload;

    return !!(
      level >= this.levelRole.Default_User && level < this.levelRole.Dev
    );
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
    const { level, hasModerationLevel } = this.payload;

    return !!(
      (level >= this.levelRole.Moderator && level < this.levelRole.Dev) ||
      hasModerationLevel
    );
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
    const issetUserLevelUtil = context.appState.utils.getState('UserLevelUtil');
    const issethasModerationLevel = context.appState.utils.getState(
      'hasModerationLevel'
    );
    if (issetUserLevelUtil && issethasModerationLevel) {
      const level = issetUserLevelUtil;
      this.payload.level = level;
      this.payload.hasModerationLevel = issethasModerationLevel;

      return !!(level >= this.levelRole.Founder && level < this.levelRole.Dev);
    }

    const { level } = await UserLevelUtil.run({
      userTgId: context.message.from.id,
    });
    const hasModerationLevel = await UserLevelUtil.hasModerationLevel({
      userTgId: context.message.from.id,
    });

    context.appState.utils.addToState({
      UserLevelUtil: level,
      hasModerationLevel,
    });

    this.payload.hasModerationLevel = hasModerationLevel;
    this.payload.level = level;
    return !!(level >= this.levelRole.Founder && level < this.levelRole.Dev);
  }

  async useDevCommands(context, next) {
    return context.message.from.id === process.env.BOT_DEV_ID;
  }
}

export default new Commands();
