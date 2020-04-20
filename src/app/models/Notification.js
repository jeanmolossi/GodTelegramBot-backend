import Sequelize, { Model } from 'sequelize';

class Notification extends Model {
  static init(sequelize) {
    super.init(
      {
        excerpt: Sequelize.STRING,
        text: Sequelize.TEXT,
        read: { type: Sequelize.BOOLEAN, defaultValue: false },
        method: Sequelize.STRING,
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'toId', as: 'to' });
    this.belongsTo(models.User, { foreignKey: 'fromId', as: 'from' });
  }
}

export default Notification;
