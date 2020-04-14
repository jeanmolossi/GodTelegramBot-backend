import Sequelize, { Model } from 'sequelize';

class Notification extends Model {
  static init(sequelize) {
    super.init(
      {
        excerpt: Sequelize.STRING,
        text: Sequelize.TEXT,
        read: { type: Sequelize.BOOLEAN, defaultValue: false },
        method: Sequelize.STRING,
        from: Sequelize.STRING,
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'tgId', as: 'to' });
  }
}

export default Notification;
