import Composer from 'telegraf/composer';
import StartMenu from './Private/StartMenu';
import HelpMenu from './Private/HelpMenu';
import SettingsMenu from './Group/SettingsMenu';

import UserLevelByGroupService from '../../../services/UserLevelByGroupService';

class MenuInitializer extends Composer {
  constructor() {
    super();

    this.use(this.logHandler.bind(this));
    this.use(Composer.acl(this.isPrivate.bind(this), StartMenu));
    this.use(Composer.acl(this.isPrivate.bind(this), HelpMenu));
    this.use(
      Composer.acl(
        this.isGroup.bind(this) && this.applicableFilterUser.bind(this),
        SettingsMenu
      )
    );
    return this;
  }

  async isPrivate(context, next) {
    if (!context.update) return next();
    if (
      (context.update.message &&
        context.update.message.chat.type === 'private') ||
      // context.update.callback_query &&
      (context.update.callback_query &&
        context.update.callback_query.message.chat.type === 'private')
    )
      return true;
    return false;
  }

  async isGroup(context, next) {
    if (!context.update) return next();
    if (
      (context.update.message &&
        context.update.message.chat.type !== 'private') ||
      // context.update.callback_query &&
      (context.update.callback_query &&
        context.update.callback_query.message.chat.type !== 'private')
    ) {
      return true;
    }
    return false;
  }

  async applicableFilterUser(context, next) {
    if (!(await this.isGroup.call(this, context, next))) return false;

    const issetUserLevelByGroupService = context.appState.utils.getState(
      'UserLevelByGroupService'
    );
    if (issetUserLevelByGroupService !== undefined) {
      return issetUserLevelByGroupService;
    }
    const utilRunner = await UserLevelByGroupService.run({
      context,
    });
    await context.appState.utils.addToState({
      UserLevelByGroupService: utilRunner,
    });
    return utilRunner;
  }

  logHandler(ctx, next) {
    if (ctx.callbackQuery) {
      console.log(
        'Callback',
        ctx.callbackQuery.data.length,
        ctx.callbackQuery.data
      );
    }
    return next();
  }
}

export default new MenuInitializer();
