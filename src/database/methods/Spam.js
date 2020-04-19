import Spam from '../../app/models/Spam';
import Group from '../../app/models/Group';

export default class SpamMethods {
  constructor(subject) {
    this.subject = subject;

    // this.subject.subscribe('apiConfig', this.apiConfig.bind(this));

    return this;
  }

  /**
   * FUNCTIONS TO VERIFY E MANAGE SPAM TEXT MESSAGES
   * @param {TELEGRAM ID FROM GROUP} groupTgId
   * @param {TEXT TO VERIFY SPAM} text
   */

  async isSpam(groupTgId, text) {
    const group = await Group.findByTgId(groupTgId);
    const spam = await Spam.findByText(text);

    if (group === null) return false;

    const groupSpam = await group.hasSpam(spam);
    if (groupSpam !== null) return groupSpam;

    const isGlobalSpam = await this.isGlobalSpam(text);
    return isGlobalSpam;
  }

  async hasSpam(groupTgId, texts) {
    for (let i = 0; i < texts.length; i += 1) {
      const check = await this.isSpam(groupTgId, texts[i]);

      if (check) return true;
    }
    return false;
  }

  async addSpam(groupTgId, text) {
    const group = await Group.findByTgId(groupTgId);
    const [spam] = await Spam.findOrCreate({
      where: { text },
    });

    await group.addSpam(spam);
  }

  async removeSpam(groupTgId, text) {
    const group = await Group.findByTgId(groupTgId);
    const spam = await Spam.findByText(text);
    await group.removeSpam(spam);
  }

  async getSpams(groupTgId) {
    const group = await Group.findByTgId(groupTgId);
    const spams = await group.getSpams();

    return spams;
  }

  async setSpams(groupTgId, texts) {
    const group = await Group.findByTgId(groupTgId);
    const spams = [];
    for (let i = 0; i < texts.length; i += 1) {
      const [spam] = await Spam.findOrCreate({
        where: { text: texts[i] },
      });
      if (spam) spams.push(spam);
    }

    const allSpams = await group.setSpams(spams);
    return allSpams;
  }

  async AddGlobalSpam(text) {
    await Spam.findOrCreate({
      where: {
        text,
      },
    });

    await Spam.update(
      { isGlobal: true },
      {
        where: {
          text,
        },
      }
    );
  }

  async isGlobalSpam(text) {
    const spam = await Spam.findOne({
      where: {
        text,
        isGlobal: true,
      },
    });

    if (spam) return true;

    return false;
  }

  async removeGlobalSpam(text) {
    await Spam.destroy({
      where: {
        text,
        isGlobal: true,
      },
    });
  }

  async getGlobalSpams() {
    const allSpams = await Spam.findAll({
      where: { isGlobal: true },
    });

    return allSpams;
  }

  async setGlobalSpams(texts) {
    await Spam.destroy({
      where: {
        isGlobal: true,
      },
    });

    for (let i = 0; i < texts.length; i += 1) {
      await this.AddGlobalSpam(texts[i]);
    }
  }

  // async getClearTimes(groupTgId) {
  //   const group = await Group.findByTgId(groupTgId);
  //   const clearPeriods = await group.getClearPeriods();
  //   return clearPeriods;
  // }

  // async setClearTimes(groupTgId, clearTimes) {
  //   const group = await Group.findByTgId(groupTgId);
  //   const oldClearPeriods = await group.getClearPeriods();
  //   await group.removeClearPeriods(oldClearPeriods);

  //   for (let i = 0; i < oldClearPeriods.length; i += 1) {
  //     await oldClearPeriods[i].destroy();
  //   }

  //   for (let i = 0; i < clearTimes.length; i += 1) {
  //     const newClearPeriod = await BotClearPeriod.create(clearTimes[i]);
  //     await group.addBotClearPeriod(newClearPeriod);
  //   }
  // }
}
