import Extra from 'telegraf/extra';

import EventEmitter from '../../store/EventEmitter';

import User from '../../app/models/User';
import Group from '../../app/models/Group';
import Product from '../../app/models/Product';
import Config from '../../app/models/Config';

import { isProduct } from '../../Utils/monetizzeUtils';

class ProductMethods {
  constructor() {
    this.subject = EventEmitter;

    this.subject.subscribe('setProductGroup', this.setProductGroup.bind(this));
    this.subject.subscribe('productAdd', this.productAdd.bind(this));

    return this;
  }

  async myProduct(userTgId) {
    const { Products } = await User.findOne({
      where: { tgId: `${userTgId}` },
      include: [{ model: Product }],
    });

    return Products;
  }

  async setProductGroup({ productId, chatId, context }) {
    try {
      const product = await Product.findByPk(productId, {
        include: [
          {
            model: Group,
            where: { tgId: `${chatId}` },
          },
        ],
      });
      if (product && product.Groups.length >= 1) {
        await context.editMessageText(
          `Este produto já foi definido neste grupo`
        );
      }
      const productNotNull = await Product.findByPk(productId);
      const group = await Group.findByTgId(chatId);
      await productNotNull.addGroup(group);
      await context.editMessageText(
        `O produto *${productNotNull.productName}* foi ` +
          `sincronizado neste grupo!`,
        Extra.markdown()
      );
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  async productAdd({ userConfig: tgId, productId, context }) {
    const userConfig = await User.findOne({
      where: { tgId: `${tgId}` },
      include: [{ model: Config }],
    });
    if (userConfig.Config === null) {
      await context.reply(`Usuário sem configuração de API`);
      return;
    }
    const { consumerKey } = userConfig.Config;
    const isProductInMonetizze = await isProduct(productId, consumerKey);
    if (!isProductInMonetizze) {
      await context.reply(`Não encontrei um produto com este código na API`);
      return;
    }
    const newProduct = await Product.create({
      productName: isProductInMonetizze.nome,
      productId: isProductInMonetizze.codigo,
    });
    await userConfig.addProduct(newProduct);
    await newProduct.setUser(userConfig);
    await context.deleteMessage();
    await context.telegram.deleteMessage(
      context.message.chat.id,
      context.message.reply_to_message.message_id
    );
    await context.reply(
      `Produto adicionado! Defina-o no grupo usando /settings`
    );
  }
}

export default new ProductMethods();
