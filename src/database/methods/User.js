import User from '../../app/models/User';
import Group from '../../app/models/Group';
import UserGroup from '../../app/models/UserGroup';
import Buy from '../../app/models/Buy';
import Product from '../../app/models/Product';
import Config from '../../app/models/Config';

import { isProduct, searchTransaction } from '../../Utils/monetizzeUtils';

class UserMethods {
  constructor(subject) {
    this.subject = subject;

    this.subject.subscribe('RegisterComplete', this.registerComplete);

    return this;
  }

  /**
   * METHODS FOR DEFAULT USERS
   */

  async getAllWarns(userTgId) {
    const user = await User.findOne({
      where: { tgId: `${userTgId}` },
      include: [{ model: Group }],
    });
    if (!user) return false;
    const group = await user.Groups;

    if (group.length >= 0 || group[0] !== undefined) {
      return group;
    }
    return false;
  }

  async updateRole(userId, role) {
    const dbLine = await UserGroup.findOne({
      where: { UserId: `${userId}` },
    });
    if (!dbLine) return false;
    dbLine.update({ userRole: `${role}` });
    return true;
  }

  async userLevel(userTgId) {
    const level = await User.findOne({
      where: { tgId: `${userTgId}` },
      attributes: ['level'],
    });
    if (!level) return false;
    return level;
  }

  async findUserByTgId(tgId) {
    const user = await User.findOrCreateByTgId(tgId);
    return user;
  }

  async registerComplete(payload) {
    const { email, vendacodigo, tgId, productId } = payload;

    const userRegister = await User.findOrCreateByTgId(tgId);

    const product = await Product.findOne({ where: { productId } });
    if (!product) return false;

    const { Config: userConfig } = await User.findOne({
      include: [{ model: Config }, { model: Product, where: { productId } }],
    });
    if (!userConfig) return false;
    const { consumerKey } = userConfig;

    if (!(await isProduct(productId, consumerKey))) return false;

    const transaction = await searchTransaction(
      email,
      vendacodigo,
      consumerKey
    );

    if (!transaction) return false;

    let buyFormat = {
      sellCode: transaction.venda.codigo,
      sellStatus: transaction.venda.status,
    };

    if (transaction.assinatura) {
      buyFormat = {
        ...buyFormat,
        signCode: transaction.assinatura.codigo || 0,
        signStatus: transaction.assinatura.status || 'Inexistente',
        signDate: transaction.assinatura.data_assinatura || new Date(),
        signType: 'Syncronizada',
      };
    }

    try {
      const newBuy = await Buy.create(buyFormat);
      await newBuy.setUser(userRegister);
      await newBuy.setProduct(product);
      await userRegister.addBuy(newBuy, { through: 'UserBuys' });
    } catch (error) {
      console.log('Error: ', error);
      return false;
    }

    return true;
  }
}

export default UserMethods;
