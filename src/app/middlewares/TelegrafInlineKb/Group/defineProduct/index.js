/**
 * @param { CRIAR SERVICE / UTIL / METHOD }
 *
 * FAZER BUSCA DE PRODUTO JA SINCRONIZADO NO GRUPO
 * DEFINIR SELECTED COM O PRODUCTID DO PRODUTO SINCRONIZADO
 *
 * FINALIZAR O SET PRODUCT GROUP
 */

import TelegrafInlineMenu from 'telegraf-inline-menu';

import EventEmitter from '../../../../../store/EventEmitter';
import ProductMethods from '../../../../../database/methods/Product';
import FindGroupProductService from '../../../../../services/FindGroupProductService';

const products = {};
const selected = {};

async function loadSyncProduct({ groupTgId }) {
  const product = await FindGroupProductService.run({ groupTgId });
  if (product !== null && product.length > 0) {
    product.map(p => {
      selected[p.id] = p.id;
      return true;
    });
  }
}

async function loadProducts(context) {
  const { callback_query } = context.update;
  const productList = await ProductMethods.myProduct(callback_query.from.id);
  if (productList.length > 0) {
    productList.map(prod => {
      Object.assign(products, {
        [prod.id]: prod.productName,
      });
      return true;
    });
  }
}

async function defineProductInstance(context) {
  if (context.update.callback_query) {
    const groupTgId = context.update.callback_query.message.chat.id;
    await loadSyncProduct({ groupTgId });
  }
  return `Sincronização de Produto e Grupo`;
}

async function chooseProductInstance(context) {
  await loadProducts(context);
  return (
    `Escolha um produto para sincronizar\n\n` +
    `Importante notar que para remover uma sincronização. Deve ser direto no Painel online, por questões de segurança`
  );
}

const defineProduct = new TelegrafInlineMenu(defineProductInstance);
const chooseProduct = new TelegrafInlineMenu(chooseProductInstance);

defineProduct.question('Adicionar produto', 'actionaddProduct', {
  uniqueIdentifier: Math.floor(Math.random() * 100000),
  questionText: 'Qual o código do produto ?',
  setFunc: (ctx, answer) => {
    // console.log('ANSWERR', ctx.update);
    const userConfig = ctx.update.message.from.id;
    EventEmitter.notify('productAdd', {
      userConfig,
      productId: answer,
      context: ctx,
    });
  },
});

defineProduct.submenu(
  'Escolher produto adicionado',
  'chooseProduct',
  chooseProduct
);

chooseProduct.select('productSelect', () => Object.keys(products), {
  setFunc: (ctx, key) => {
    selected[key] = key;
    const productId = selected[key];
    const chatId = ctx.update.callback_query.message.chat.id;
    EventEmitter.notify('setProductGroup', {
      productId,
      chatId,
      context: ctx,
    });
  },
  textFunc: (ctx, key) => {
    return products[key];
  },
  isSetFunc: (ctx, key) => {
    selected[key] = selected[key] || -1;
    return selected[key].toString() === key;
  },
  // setMenuAfter: true,
  columns: 1,
});

export default defineProduct;
