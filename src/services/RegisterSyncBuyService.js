import * as yup from 'yup';

import Buy from '../app/models/Buy';
import Product from '../app/models/Product';
import Config from '../app/models/Config';

import User from '../app/models/User';

import { isProduct, searchTransaction } from '../Utils/monetizzeUtils';

class RegisterSyncBuyService {
  async run(payload) {
    console.log(payload);
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

    console.log(transaction);

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
        signPlanPeriod: transaction.plano.periodicidade,
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
      await product.addBuy(newBuy);
      await userRegister.addBuy(newBuy, { through: 'UserBuys' });
      return true;
    } catch (error) {
      console.log('Error: ', error);
      return false;
    }
  }
}

export default new RegisterSyncBuyService();
