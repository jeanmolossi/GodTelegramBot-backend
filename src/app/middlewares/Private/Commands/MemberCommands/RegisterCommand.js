import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';

import RegisterSyncBuyService from '../../../../../services/RegisterSyncBuyService';

class RegisterCommand extends Composer {
  constructor() {
    super();

    this.dados = {
      email: null,
      vendacodigo: null,
      tgId: null,
    };

    this.command('register', this.commandAction.bind(this));
    this.hears(/^\/email \w/, this.registerStart.bind(this));
  }

  async commandAction(context, next) {
    await context.reply(
      `Certo, para você registrar-se vou te enviar um passo a passo. Leia com atenção`
    );
    await context.reply(
      `Primeiro, tenha em mãos todos seus dados de\n\n` +
        `E-mail de compra,\nCódigo de compra e\nCódigo do produto\n\n` +
        `Após ter esses dados em mãos preciso que me envie da seguinte maneira:\n` +
        `/email seu@email.com\n\nAguarde minha confirmação e em seguida envie:\n` +
        `/compra 123456\n\nAssim que eu te confirmar que recebi seus dados prossiga com\n` +
        `/produto 123456\n\nApós identificar os dados enviados, prossiga com o registro...`,
      Extra.markup((m) =>
        m.inlineKeyboard([
          m.urlButton(
            'Onde conseguir o código do produto?',
            'https://app.monetizze.com.br/loja'
          ),
        ])
      )
    );
    await context.reply(
      `Para encontrar o código do produto acesse o botão acima e busque pelo seu ` +
        `produto comprado.\nEm seguida acesse "Ver detalhes"\nE na descrição do produto encontre "Código do produto"`
    );
    await context.reply(
      `Vamos começar ?`,
      Extra.markup((m) =>
        m.inlineKeyboard([m.callbackButton('Sim!', 'registerStart')])
      )
    );
  }

  async registerStart(context, next) {
    console.log(context);
    const [, email] = context.message.text.split(' ');
    if (!email || !email.match(/\w[^@]+@[^@]+\.[^@]+$/)) {
      await context.reply(
        `Não me parece um email...\n` +
          `Pode ser que não funcione seu cadastro se não me enviar um e-mail válido`
      );
      return false;
    }
    this.dados.tgName = context.message.from.first_name;
    this.dados.email = email;
    await context.reply(
      `Se seu e-mail for ${email} me envie o código de compra com o comando /compra antes\n\nPor exemplo:\n/compra 123456789\n\n` +
        `Caso tenha digitado seu e-mail incorretamente, basta reenviar seu e-mail com o comando /email na frente`
    );
    this.hears(/^\/compra \w/, async (secCtx, next2) => {
      const [, codigo] = secCtx.message.text.split(' ');
      console.log('Código IDENTIFICADO', codigo);
      if (!codigo || !codigo.match(/[0-9]/)) {
        await secCtx.reply(
          `Somente números na id. da compra, não há outros caracteres.`
        );
        return false;
      }
      this.dados.vendacodigo = codigo;
      await secCtx.reply(
        `Entendi. Se seu código for ${codigo}, envie o código do produto com o comando /produto antes\n\n` +
          `Novamente, se o código estiver incorreto, basta reenviar o código com o comando /compra na frente\n\n`
      );
      return true;
    });
    this.hears(/^\/produto \w/, async (pCtx, next3) => {
      const [, productId] = pCtx.message.text.split(' ');
      if (!productId || !productId.match(/[0-9]/)) {
        await pCtx.reply('Somente números no código, não há outros caracteres');
        return false;
      }
      this.dados.productId = productId;
      const dados = `${this.dados.email}\nCompra: ${this.dados.vendacodigo}\nProduto: ${productId}`;
      await pCtx.reply(
        `Verifique seus dados:\n${dados}\nSe estiver tudo correto toque no comando abaixo:\n/registrocompleto`
      );
      return true;
    });
    this.hears(/^\/registrocompleto/, async (trdCtx, next4) => {
      if (this.dados.email !== null && this.dados.vendacodigo !== null) {
        this.dados.tgId = trdCtx.message.from.id;
        try {
          const userValid = await RegisterSyncBuyService.run(this.dados);
          if (userValid) {
            await trdCtx.reply(
              `Obrigado. Enviei seus dados para registro.\n` +
                `Agora, nossa equipe irá confirmar seus dados.\n` +
                `Aguarde cerca de 5 minutos. Não deve demorar mais que isso\n\n` +
                `Caso após isso você não conseguir acessar, tente novamente pelo painel\n` +
                `Basta dar um /help e ir em Perguntas frequentes > Sobre registro > Como faço o registro?\n`
            );
            return true;
          }
          await trdCtx.reply(
            `Dados não encontrados na API, verifique se as informações estão corretas`
          );
          return false;
        } catch (error) {
          await trdCtx.reply(
            `Algo saiu errado, não foi possível concluir seu registro`
          );
          return false;
        }
      } else {
        await trdCtx.reply(`Os dados não foram enviados corretamente`);
      }
      return false;
    });
    return next();
  }
}

export default new RegisterCommand();
