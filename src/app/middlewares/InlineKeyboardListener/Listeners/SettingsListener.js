import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';
import Markup from 'telegraf/markup';

import EventEmitter from '../../../../store/EventEmitter';

import RuleMethods from '../../../../database/methods/Rule';
import ProductMethods from '../../../../database/methods/Product';

class SettingsListener extends Composer {
  constructor() {
    super();

    this.subject = EventEmitter;

    this.utilData = {
      monetizzeUrl: 'https://app.monetizze.com.br/ferramentas/api',
      monetizzeLoja: 'https://app.monetizze.com.br/loja',
    };

    this.action('settingsWelcome', this.settingsAction.bind(this));
    this.action('rulesConfig', this.rulesConfig.bind(this));
    this.action('apiAdjust', this.apiAdjust.bind(this));
    this.action('defineProduct', this.defineProduct.bind(this));
    this.action('settingsProductAdd', this.settingsProductAdd.bind(this));
    this.action(/productSelect_[0-9]/, this.productSelect.bind(this));
    this.action(/setRule_[0-9]_(on|off)/, this.setRule.bind(this));

    this.action('settingsCancel', this.settingsCancel.bind(this));
  }

  async settingsAction(context, next) {
    // console.log('CALLED', context);
    if (!context.update.callback_query) return next();
    try {
      await context.editMessageText(
        `Abaixo estão as configurações que você pode alterar\n` +
          `Você pode alterar também direto no painel!`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('Ativar / Desativar regras', 'rulesConfig')],
            [m.callbackButton('Ajustar configurações de API', 'apiAdjust')],
            [m.callbackButton('Definir produto', 'defineProduct')],
            [m.callbackButton('Cancelar', 'settingsCancel')],
          ])
        )
      );
    } catch (error) {
      return false;
    }
    return next();
  }

  async rulesConfig(context, next) {
    if (!context.update.callback_query) return next();
    try {
      const rulesDb = await RuleMethods.getGroupRules(
        context.update.callback_query.message.chat.id
      );
      let buttons = null;
      let buttonsAdded = null;

      const ruleType = [
        'NULL_INPUT',
        'DENY_SPAM', // 1
        'DENY_FLOOD', // 2
        'DENY_BOT', // 3
        'DENY_BOT_FORWARD', // 4
        'DENY_CHAT_FORWARD', // 5
        'DENY_LINK', // 6
      ];
      const ruleName = [
        'Erro',
        'Anti-Spam',
        'Anti-Flood',
        'Anti-Bot',
        'Anti-Encaminhar-de-bot',
        'Anti-Enchaminhar-de-chats',
        'Anti-Link',
      ];
      buttons = [];
      buttonsAdded = [];
      if (rulesDb && rulesDb.length > 0) {
        rulesDb.map((ruleDB) => {
          const ruleId = ruleType.indexOf(ruleDB.type);
          if (ruleId > 0) {
            buttonsAdded.push(ruleId);
            buttons.push([
              Markup.callbackButton(
                `❌ Desativar ${ruleName[ruleId]}`,
                `setRule_${ruleId}_off`
              ),
            ]);
          }
          return true;
        });
      }
      ruleType.map((rule) => {
        const ruleId = ruleType.indexOf(rule);
        if (buttonsAdded.indexOf(ruleId) < 0 && ruleId !== 0) {
          buttons.push([
            Markup.callbackButton(
              `✔️ Ativar ${ruleName[ruleId]}`,
              `setRule_${ruleId}_on`
            ),
          ]);
        }
        return true;
      });
      buttons.push([Markup.callbackButton('Voltar', 'settingsWelcome')]);
      buttons.push([Markup.callbackButton('Cancelar', 'settingsCancel')]);

      await context.editMessageText(
        `Escolha as regras que deseja ajustar\n` +
          `Você pode alterar também direto no painel!`,
        Extra.markup((m) => {
          return buttons !== null
            ? m.inlineKeyboard(buttons)
            : m.inlineKeyboard([
                [m.callbackButton('Voltar', 'settingsWelcome')],
                [m.callbackButton('Cancelar', 'settingsCancel')],
              ]);
        })
      );
    } catch (error) {
      return false;
    }
    return next();
  }

  async setRule(context, next) {
    const { data } = context.update.callback_query;
    const chatId = context.update.callback_query.message.chat.id;
    const [ruleId, ruleStats] = data.replace(/setRule_/, '').split('_');
    this.subject.notify('setRule', {
      ruleId,
      ruleStats,
      chatId,
      userId: context.update.callback_query.from.id,
      context,
    });
    try {
      await context.editMessageText(
        `Abaixo estão as configurações que você pode alterar\n` +
          `Você pode alterar também direto no painel!`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('Ativar / Desativar regras', 'rulesConfig')],
            [m.callbackButton('Ajustar configurações de API', 'apiAdjust')],
            [m.callbackButton('Definir produto', 'defineProduct')],
            [m.callbackButton('Cancelar', 'settingsCancel')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }

  async apiAdjust(context, next) {
    try {
      await context.editMessageText(
        `_Configuração de API_\n*Essa alteração afeta sua configuração pessoal da API do bot*\n` +
          `Para prosseguir, responda à esta mensagem com o código da API ` +
          `fornecido pela Monetizze.`,
        Extra.markdown().markup((m) =>
          m.inlineKeyboard([
            [
              m.urlButton(
                'Pegar meu código API',
                `${this.utilData.monetizzeUrl}`
              ),
            ],
            [m.callbackButton('Voltar', 'settingsWelcome')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }

  async defineProduct(context, next) {
    console.log('Product definig', context.update);
    const { callback_query } = context.update;
    const productList = await ProductMethods.myProduct(callback_query.from.id);
    let btn = null;
    if (productList.length > 0) {
      btn = productList.map((prod) =>
        Markup.callbackButton(`${prod.productName}`, `productSelect_${prod.id}`)
      );
    }

    await context.editMessageText(
      `Certifique-se de já ter configurado sua API\n` +
        `Com a API já configurada, adicione seu primeiro produto antes de ` +
        `sincronizá-lo neste grupo. Após adicionar ele aparecerá junto nos ` +
        `botões abaixo`,
      Extra.markup((m) => {
        return btn !== null
          ? m.inlineKeyboard([
              btn,
              [m.callbackButton('Adicionar produto', 'settingsProductAdd')],
              [m.callbackButton('Voltar', 'settingsWelcome')],
            ])
          : m.inlineKeyboard([
              [m.callbackButton('Ajustar configurações de API', 'apiAdjust')],
              [m.callbackButton('Adicionar produto', 'settingsProductAdd')],
              [m.callbackButton('Sem produtos - Voltar', 'settingsWelcome')],
            ]);
      })
    );
  }

  async settingsProductAdd(context, next) {
    await context.editMessageText(
      `_Adicionar produto_\n` +
        `Para adicionar o produto, *responda à esta mensagem* com o código do ` +
        `produto, fornecido na Monetizze para adicioná-lo à seus produtos\n\n` +
        `_Você deve selecionar esta mensagem e marcar como responder!_`,
      Extra.markdown().markup((m) =>
        m.inlineKeyboard([
          [
            m.urlButton(
              'Buscar código de produto',
              `${this.utilData.monetizzeLoja}`
            ),
          ],
          [m.callbackButton('Voltar', 'defineProduct')],
        ])
      )
    );
  }

  async productSelect(context, next) {
    const { data } = context.update.callback_query;
    const chatId = context.update.callback_query.message.chat.id;
    const productId = parseInt(data.replace(/productSelect_/, ''), 10);
    await this.subject.notify('setProductGroup', {
      productId,
      chatId,
      context,
    });
  }

  async settingsCancel(context, next) {
    if (!context.update.callback_query) return next();
    try {
      const response = await context.deleteMessage();
      return response;
    } catch (error) {
      console.log(error);
    }
    return next();
  }
}

export default new SettingsListener();
