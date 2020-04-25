import Notification from '../app/models/Notification';
import User from '../app/models/User';

class SendNotificationService {
  async run({ userFrom, userTo, notificationBody }) {
    // CHAT.ID IS THE USER FROM

    const userToSelector = await User.findByTgId(userTo);
    if (!userToSelector) return false;

    const userFromSelector = await User.findByTgId(userFrom);

    const sendNotification = await Notification.create(notificationBody);
    await sendNotification.setTo(userToSelector);
    await sendNotification.setFrom(userFromSelector);

    return true;
  }
}

export default new SendNotificationService();
