import Composer from 'telegraf/composer';

import MemberCommands from './MemberCommands';
import HelperCommands from './HelperCommands';
import SubModeratorCommands from './SubModeratorCommands';
import ModeratorCommands from './ModeratorCommands';
import AdministratorCommands from './AdministratorCommands';
import CoFounderCommands from './CoFounderCommands';
import FounderCommands from './FounderCommands';
import DevCommands from './DevCommands';

export default class Commands extends Composer {
  constructor(database) {
    super();

    this.database = database;
    this.levelRole = database.levelRole;
    this.payload = {};

    this.use(
      Composer.acl(this.useDevCommands.bind(this), new DevCommands(database))
    );
    this.use(
      Composer.acl(
        this.useFounderCommands.bind(this),
        new FounderCommands(database)
      )
    );
    this.use(
      Composer.acl(
        this.useCoFounderCommands.bind(this),
        new CoFounderCommands(database)
      )
    );
    this.use(
      Composer.acl(
        this.useAdministratorCommands.bind(this),
        new AdministratorCommands(database)
      )
    );
    this.use(
      Composer.acl(
        this.useModeratorCommands.bind(this),
        new ModeratorCommands(database)
      )
    );
    this.use(
      Composer.acl(
        this.useSubModeratorCommands.bind(this),
        new SubModeratorCommands(database)
      )
    );
    this.use(
      Composer.acl(
        this.useHelperCommands.bind(this),
        new HelperCommands(database)
      )
    );
    this.use(
      Composer.acl(
        this.useMemberCommands.bind(this),
        new MemberCommands(database)
      )
    );
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

  async useMemberCommands(context, next) {
    const { level } = this.payload;
    return !!(
      level >= this.levelRole.Default_User && level < this.levelRole.Dev
    );
  }

  async useHelperCommands(context, next) {
    const { level } = this.payload;
    return !!(level >= this.levelRole.Helper && level < this.levelRole.Dev);
  }

  async useSubModeratorCommands(context, next) {
    const { level } = this.payload;
    return !!(
      level >= this.levelRole.SubModerator && level < this.levelRole.Dev
    );
  }

  async useModeratorCommands(context, next) {
    const { level } = this.payload;
    return !!(level >= this.levelRole.Moderator && level < this.levelRole.Dev);
  }

  async useAdministratorCommands(context, next) {
    const { level } = this.payload;
    return !!(
      level >= this.levelRole.Administrator && level < this.levelRole.Dev
    );
  }

  async useCoFounderCommands(context, next) {
    const { level } = this.payload;
    return !!(level >= this.levelRole.CoFounder && level < this.levelRole.Dev);
  }

  async useFounderCommands(context, next) {
    const { level } = await this.database.userMethods.userLevel(
      context.message.from.id
    );
    this.payload.level = level;
    return !!(level >= this.levelRole.Founder && level < this.levelRole.Dev);
  }

  async useDevCommands(context, next) {
    return context.message.from.id === process.env.BOT_DEV_ID;
  }
}
