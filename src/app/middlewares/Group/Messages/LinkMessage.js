import Composer from 'telegraf';
import { warn } from '../../../../Utils/groupUtils';

import RuleMethods from '../../../../database/methods/Rule';

class LinkMessage extends Composer {
  constructor() {
    super();

    this.use(this.messageFilter.bind(this));
  }

  async messageFilter(context, next) {
    if (!context.message) return next();
    const { chat, from } = context.message;
    let regexes = [];
    let GroupRules = [];
    const issetGroupRules = context.appState.utils.getState('GroupRules');
    if (issetGroupRules !== undefined) {
      GroupRules = issetGroupRules;
    } else {
      GroupRules = await RuleMethods.getGroupRules(chat.id);
      context.appState.utils.addToState({
        GroupRules,
      });
    }
    try {
      regexes = GroupRules.map((rule) => rule.type)
        .filter((rule) => rule.includes('DENY_LINK_'))
        .map((rule) => rule.replace('DENY_LINK_', ''))
        .map((regex) => new RegExp(regex, 'gmi'));
    } catch (error) {
      return next();
    }

    const urls = this.getUrls(context);

    for (const url of urls) {
      for (const regex of regexes) {
        if (regex.test(url)) {
          if (warn(context, from.id, 1, 'Enviando links') > 0) {
            await context.deleteMessage();
          }
          return;
        }
      }
    }
    return next();
  }

  getUrls(context) {
    const url = (context.message.entities || [])
      .filter((entity) => entity.type === 'url')
      .map((entity) =>
        context.message.text.substring(
          entity.offset,
          entity.offset + entity.length
        )
      );

    return url;
  }
}
export default new LinkMessage();
