import * as yup from 'yup';

import Product from '../models/Product';
import Buy from '../models/Buy';
import User from '../models/User';
import Config from '../models/Config';

import { searchTransaction, isProduct } from '../../Utils/monetizzeUtils';

class BuyController {
  async index(req, res) {
    const { id } = req.params;
    if (id) {
      const buy = await Buy.findOne({
        where: { id, UserId: req.userId },
      });
      if (!buy) return res.status(400).json({ error: 'Buy not registered' });

      return res.json(buy);
    }

    const myBuys = await Buy.findAll({
      where: { UserId: req.userId },
    });
    if (!myBuys)
      return res.status(400).json({ error: 'Has not buys registered' });

    return res.json(myBuys);
  }

  async indexSell(req, res) {
    const products = await Product.findAll({
      where: { UserId: req.userId, productActive: true },
      attributes: ['id', 'productName', 'productMonetizze'],
      include: [
        {
          model: Buy,
          attributes: [
            'id',
            'sellCode',
            'sellStatus',
            'signStatus',
            'signDate',
            'signType',
            'signPlanPeriod',
            'signUntil',
          ],
        },
      ],
    });
    return res.json(products);
  }

  async storeSync(req, res) {
    const { transactionCode, productId } = req.body;
    const schema = yup.object().shape({
      transactionCode: yup.number().required(),
      productId: yup.number().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Invalid data request' });

    const product = await Product.findOne({
      where: { productId, productActive: true },
    });
    if (!product) return res.status(400).json({ error: 'Product not found' });

    const transactionExists = await Buy.findOne({
      where: { sellCode: transactionCode },
    });
    if (transactionExists)
      return res.status(400).json({ error: 'Transaction is already in use' });

    const loggedUser = await User.findByPk(req.userId);
    if (product.productMonetizze === true) {
      const { Config: userConfig } = await User.findOne({
        include: [{ model: Config }, { model: Product, where: { productId } }],
      });

      if (!userConfig)
        return res.status(400).json({ error: 'User config not found!' });

      const { consumerKey } = userConfig;

      if (!(await isProduct(productId, consumerKey))) return false;

      const transaction = await searchTransaction(
        loggedUser.email,
        transactionCode,
        consumerKey
      );
      if (!transaction)
        return res
          .status(400)
          .json({ error: 'Transaction not found in Monetizze' });

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
        const newBuy = await Buy.create(buyFormat);
        await newBuy.setUser(loggedUser);
        await newBuy.setProduct(product);
        await product.addBuy(newBuy);
        await loggedUser.addBuy(newBuy, { through: 'UserBuys' });

        return res.json(newBuy);
      } catch (error) {
        return res.status(500).json({ error });
      }
    }

    const transaction = await Buy.findOne({
      where: { sellCode: transactionCode, UserId: null },
      include: [
        {
          model: Product,
          where: { productId },
        },
      ],
    });

    if (!(transaction && transaction.Product))
      return res.status(400).json({ error: 'Transaction not found in API!' });

    await transaction.setUser(loggedUser);
    await product.addBuy(transaction);
    await loggedUser.addBuy(transaction);

    return res.json(transaction);
  }

  async storeRegister(req, res) {
    const schema = yup.object().shape({
      sellCode: yup.number().required(),
      sellStatus: yup.string().required(),
      signStatus: yup.string().required(),
      signDate: yup.date().required(),
      signType: yup.string().required(),
      signPlanPeriod: yup.string().required(),
      productId: yup.number().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Invalid data request' });

    const { productId } = req.body;
    const productExist = await Product.findOne({
      where: {
        productId,
        UserId: req.userId,
        productActive: true,
        productMonetizze: false,
      },
    });
    if (!productExist)
      return res.status(400).json({ error: 'Product is not found!' });

    const signCode = Math.floor(Math.random() * 100000);

    const newBuyRegister = await Buy.create({
      ...req.body,
      signCode,
      ProductId: productExist.id,
    });
    await productExist.addBuy(newBuyRegister);

    return res.json(newBuyRegister);
  }
}

export default new BuyController();
