import Composer from 'telegraf/composer';

import Commands from './Commands';

export default class Private extends Composer {
  constructor(database, subject) {
    super();

    this.database = database;
    this.subject = subject;
    this.use(this.privateListener.bind(this));
    this.use(
      Composer.acl(this.isPrivate.bind(this), new Commands(database, subject))
    );
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
    const user = await this.database.userMethods.findUserByTgId(
      context.message.from.id
    );
    if (!user) return false;
    if (user.tgPic === null) {
      const profilePic = await context.telegram.getUserProfilePhotos(user.tgId);
      const { file_id, file_unique_id } = profilePic.photos[0][0];
      const getFile = await context.telegram.getFile(file_id);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${getFile.file_path}`; // DOWNLOAD URL
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
