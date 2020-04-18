import Extra from 'telegraf/extra';
import * as yup from 'yup';
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

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

    // this.subject.subscribe('RegisterComplete', this.registerComplete);
    this.subject.subscribe('infoCommand', this.infoCommand.bind(this));
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

  async findUserByTgId(tgId, name = null) {
    const user = await User.findOrCreateByTgId(tgId, name);
    return user;
  }

  async registerComplete(payload) {
    const { email, vendacodigo, tgId, productId, tgName } = payload;
    const schema = yup.object().shape({
      email: yup.string().email().required(),
      vendacodigo: yup.number().required(),
      productId: yup.number().required(),
    });

    if (!(await schema.isValid(payload))) throw new Error('Invalid data');

    const userRegister = await User.findOrCreateByTgId(tgId, tgName);

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
      const toUpdate = {
        email: null,
        name: null,
      };
      if (userRegister && userRegister.email === (null || ''))
        toUpdate.email = email;

      if (userRegister.name === (null || ''))
        toUpdate.name = transaction.comprador.nome;

      if (toUpdate.email !== null)
        userRegister.update({ name: toUpdate.name, email: toUpdate.email });

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

  async findUserCompleteByTgId(userTgId) {
    const user = await User.findOne({
      where: { tgId: `${userTgId}` },
      include: [
        {
          model: Buy,
          include: [
            {
              model: Product,
              include: [{ model: Group }],
            },
          ],
        },
      ],
    });
    return user;
  }

  async userWarnsByTgId(userTgId) {
    const user = await User.findOne({
      where: { tgId: `${userTgId}` },
      include: [
        {
          model: Group,
        },
      ],
    });
    return user;
  }

  async infoCommand({ infoMember, toTgId, context }) {
    try {
      const user = await this.findUserCompleteByTgId(infoMember.user.id);
      const userWarns = await this.userWarnsByTgId(infoMember.user.id);
      // console.log(userWarns.Groups);
      const [groupsWarns] = userWarns.Groups.filter(
        (group) =>
          group.UserGroup &&
          group.tgId.toString() === context.update.message.chat.id.toString()
      );
      let userBuys;
      if (user.Buys && user.Buys.length >= 1) {
        userBuys = user.Buys.map((buy) => {
          const formattedDate = formatDistance(buy.signDate, new Date(), {
            addSuffix: true,
            locale: pt,
          });
          return (
            `Produto: ${buy.Product.productId}\nCompra: ${buy.sellCode}\n` +
            `Status da transação: ${buy.sellStatus}\nAssinatura: ${buy.signStatus}\n` +
            `Assinado ${formattedDate}`
          );
        });
      }
      if (userBuys !== undefined) {
        await context.telegram.sendMessage(
          toTgId,
          `Relatório do usuário: ` +
            `[${infoMember.user.first_name}](tg://user?id=${infoMember.user.id})\n\n` +
            `${userBuys.join('\n\n')}\n\nNo grupo *${
              groupsWarns.name
            }* esse usuário ` +
            `possui (${groupsWarns.UserGroup.warnsNumber} de 3) alertas`,
          Extra.markdown()
        );
        return true;
      }
    } catch (error) {
      console.log(error);
    }
    await context.telegram.sendMessage(
      toTgId,
      `Não consigo buscar dados para o relatório`,
      Extra.markdown()
    );
    return false;
  }
}

export default UserMethods;
