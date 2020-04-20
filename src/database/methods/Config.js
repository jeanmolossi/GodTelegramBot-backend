import User from '../../app/models/User';
import Config from '../../app/models/Config';

import EventEmitter from '../../store/EventEmitter';

class ConfigMethods {
  constructor() {
    this.subject = EventEmitter;

    this.subject.subscribe('apiConfig', this.apiConfig.bind(this));

    return this;
  }

  async apiConfig({ userConfig, apiCode, context }) {
    const user = await User.findOne({
      where: { tgId: `${userConfig}` },
      include: [{ model: Config }],
    });
    if (user.Config === null) {
      const [newConfig] = await Config.findOrCreate({
        where: { consumerKey: apiCode },
      });
      await user.setConfig(newConfig);
      await context.deleteMessage();
      await context.telegram.deleteMessage(
        context.message.chat.id,
        context.message.reply_to_message.message_id
      );
      await context.telegram.sendMessage(
        context.message.from.id,
        `Sua configuração de API foi definida com sucesso!`
      );
      return true;
    }
    await context.deleteMessage();
    await context.telegram.deleteMessage(
      context.message.chat.id,
      context.message.reply_to_message.message_id
    );
    await context.reply(
      `Usuário já possui uma configuração de API definida, para alterá-la deve ser feita pelo painel web`
    );
    return false;
  }
}

export default new ConfigMethods();
