import Sequelize, { Model } from 'sequelize';

class Spam extends Model {
  static init(sequelize) {
    super.init(
      {
        text: { type: Sequelize.STRING, unique: true },
        isGlobal: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Group, { through: 'SpamsGroup' });
  }

  static async findByText(text) {
    const spam = await this.findOne({
      where: { text },
    });

    return spam;
  }
}

export default Spam;
