import Sequelize, { Model } from 'sequelize';

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        productName: Sequelize.STRING,
        productId: { type: Sequelize.STRING, unique: true },
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Group, { through: 'ProductGroup' });
    this.belongsToMany(models.Buy, { through: 'ProductBuys' });
    this.belongsTo(models.User, { through: 'UserProduct' });
  }
}

export default Product;
