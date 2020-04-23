import Composer from 'telegraf/composer';

import SimpleFindUserByTgId from '../../../Utils/UserMethods/SimpleFindUserByTgId';

import Commands from './Commands';

class Private extends Composer {
  constructor() {
    super();

    this.use(this.privateListener.bind(this));
    this.use(Composer.acl(this.isPrivate.bind(this), Commands));
  }

  async isPrivate(context, next) {
    if (context.message && context.message.chat.type === 'private') {
      return true;
    }
    return false;
  }

  async privateListener(context, next) {
    if (!context.message) return next();
    if (context.message.chat.type !== 'private') return next();

    const issetSimpleFindUserByTgId = context.appState.utils.getState(
      'SimpleFindUserByTgId'
    );
    if (issetSimpleFindUserByTgId) {
      return next();
    }

    const user = await SimpleFindUserByTgId.run({
      userTgId: context.message.from.id,
    });
    if (!user) return false;

    context.appState.utils.addToState({
      SimpleFindUserByTgId: user.dataValues,
    });

    if (user.tgPic === null) {
      let file_id = null;
      const profilePic = await context.telegram.getUserProfilePhotos(user.tgId);

      if (profilePic.total_count > 0) {
        // const { file_unique_id } = profilePic.photos[0][0];
        file_id = profilePic.photos[0][0].file_id;
        // const getFile = await context.telegram.getFile(file_id);
        // const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${getFile.file_path}`; // DOWNLOAD URL
      } else {
        file_id = null;
      }

      if (user.name === null) {
        user.update({ name: context.message.from.first_name, tgPic: file_id });
      } else {
        user.update({ tgPic: file_id });
      }
    }
    return next();
    // console.log(fileUrl);
    // await context.reply(fileUrl);
    // await context.telegram.sendPhoto( context.message.from.id, file_id );
  }
}

export default new Private();
