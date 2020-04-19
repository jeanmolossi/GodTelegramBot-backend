import Composer from 'telegraf';
import { warn } from '../../../../Utils/groupUtils';

export default class LinkMessage extends Composer {
  constructor(database) {
    super();

    this.database = database;
    this.use(this.messageFilter.bind(this));
  }

  async messageFilter(context, next) {
    const { chat, from } = context.message;
    let regexes = [];
    try {
      regexes = (await this.database.ruleMethods.getGroupRules(chat.id))
        .map((rule) => rule.type)
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
          if (warn(context, this.database, from.id, 1, 'Enviando links') > 0) {
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
