import Sequelize, { Model } from 'sequelize';

class Buy extends Model {
  static init(sequelize) {
    super.init(
      {
        sellCode: { type: Sequelize.STRING, unique: true },
        sellStatus: Sequelize.STRING,
        signCode: Sequelize.STRING,
        signStatus: Sequelize.STRING,
        signDate: Sequelize.DATE,
        signType: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { through: 'UserBuys' });
    this.belongsTo(models.Product, { through: 'ProductBuys' });
  }
}

export default Buy;
