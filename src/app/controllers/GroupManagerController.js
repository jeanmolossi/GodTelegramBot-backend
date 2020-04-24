import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO, format } from 'date-fns';

import GroupManager from '../models/GroupManager';
import Group from '../models/Group';

class GroupManagerController {
  constructor() {
    return this;
  }

  async index(req, res) {
    const { startDate, endDate } = req.query;
    const { id } = req.params;

    const reports = await GroupManager.findAll({
      where: {
        tgId: id,
        createdAt: {
          [Op.between]: [
            parseISO(
              format(parseInt(startDate, 10), "yyyy-MM-dd'T'HH:mm:ssxxx")
            ),
            startOfDay(
              parseISO(
                format(parseInt(endDate, 10), "yyyy-MM-dd'T'HH:mm:ssxxx")
              )
            ),
          ],
        },
      },
    });

    return res.json(reports);
  }

  static async store(chatId, context) {
    const group = await Group.findByTgId(chatId);
    const chatMembers = await context.telegram.getChatMembersCount(chatId);
    let newReport = null;
    newReport = await GroupManager.findOne({
      where: {
        tgId: group.id,
        createdAt: {
          [Op.between]: [
            startOfDay(new Date().getTime()),
            endOfDay(new Date().getTime()),
          ],
        },
      },
    });
    if (newReport === null) {
      newReport = await GroupManager.create({
        userCount: chatMembers,
      });
    }
    await newReport.setGroupReport(group.id);
    return true;
  }

  async incrementUser(chatId, context) {
    // console.log('INCREMENTING');
    let report = null;
    report = await GroupManager.findOne({
      where: {
        createdAt: {
          [Op.between]: [
            startOfDay(new Date().getTime()),
            endOfDay(new Date().getTime()),
          ],
        },
      },
    });
    if (!report || report === null) {
      report = await GroupManagerController.store(chatId, context);
    }
    await report.increment({
      totalDayMembers: 1,
      userCount: 1,
      newMembers: 1,
    });
    return true;
  }

  async decrementUser(chatId, context) {
    // console.log('DECREMENTING');
    let report = null;
    report = await GroupManager.findOne({
      where: {
        createdAt: {
          [Op.between]: [
            startOfDay(new Date().getTime()),
            endOfDay(new Date().getTime()),
          ],
        },
      },
    });
    if (!report || report === null) {
      report = await GroupManagerController.store(chatId, context);
    }
    await report.decrement({
      totalDayMembers: 1,
      userCount: 1,
    });
    await report.increment({
      leftMembers: 1,
    });
    return true;
  }
}

export default new GroupManagerController();
