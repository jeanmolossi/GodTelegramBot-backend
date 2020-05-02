import * as yup from 'yup';

import Notification from '../models/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const notifications = await Notification.findAll({
      where: { toId: req.userId },
      order: [['createdAt', 'DESC']],
    });
    if (!notifications || notifications.length <= 0)
      return res.status(200).json({ message: 'You do not have notifications' });

    return res.json(notifications);
  }

  async store(req, res) {
    const schema = yup.object().shape({
      excerpt: yup.string().required(),
      text: yup.string().required(),
      method: yup.string().required(),
      userTo: yup.string().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Invalid request data' });

    const { userTo } = req.body;
    const userToSelector = await User.findByTgId(userTo);
    if (!userToSelector)
      return res.status(400).json({ error: 'Destination user not found' });

    const sendNotification = await Notification.create(req.body);
    await sendNotification.setTo(userToSelector);
    await sendNotification.setFrom(req.userId);

    return res.json(sendNotification);
  }

  async update(req, res) {
    const { id } = req.params;
    const notification = await Notification.findOne({
      where: { id, toId: req.userId },
    });
    if (!notification || notification.length <= 0)
      return res
        .status(400)
        .json({ error: 'Invalid notification update request' });

    await notification.update({ read: !notification.read });
    return res.json(notification);
  }
}

export default new NotificationController();
