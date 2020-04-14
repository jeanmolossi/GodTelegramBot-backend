import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';

export default class RegisterCommand extends Composer {
  constructor(database, subject) {
    super();
    this.subject = subject;
    this.database = database;

    this.dados = {
      email: null,
      vendacodigo: null,
      tgId: null,
    };

    this.command('register', this.commandAction.bind(this));
    this.action('registerStart', this.registerStart.bind(this));
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
        `produto comprado.\n Em seguida acesse "Ver detalhes"\nE na descrição do produto encontre "Código do produto"`
    );
    await context.reply(
      `Vamos começar ?`,
      Extra.markup((m) =>
        m.inlineKeyboard([m.callbackButton('Sim!', 'registerStart')])
      )
    );
  }

  async registerStart(context, next) {
    const [, email] = context.message.text.split(' ');
    this.dados.email = email;
    await context.reply(
      `Se seu e-mail for ${email} me envie o código de compra com o comando /compra antes`
    );
    await context.reply(`Por exemplo:\n/compra 123456789`);
    this.hears(/^\/compra [0-9]/, async (secCtx) => {
      const [, codigo] = secCtx.message.text.split(' ');
      this.dados.vendacodigo = codigo;
      await secCtx.reply(
        `Entendi. Envie o código do produto com o comando /produto antes`
      );
    });
    this.hears(/^\/produto [0-9]/, async (pCtx) => {
      const [, productId] = pCtx.message.text.split(' ');
      this.dados.productId = productId;
      const dados = `${this.dados.email}\nCompra: ${this.dados.vendacodigo}\nProduto: ${productId}`;
      await context.reply(
        `Verifique seus dados:\n${dados}\nSe estiver tudo correto:\n/registrocompleto`
      );
    });
    this.hears(/^\/registrocompleto/, async (trdCtx) => {
      if (this.dados.email !== null && this.dados.vendacodigo !== null) {
        this.dados.tgId = trdCtx.message.from.id;
        this.subject.notify('RegisterComplete', this.dados);
        await context.reply(
          `Obrigado. Enviei seus dados para registro.\n` +
            `Agora, nossa equipe irá confirmar seus dados.\n` +
            `Aguarde cerca de 5 minutos. Não deve demorar mais que isso`
        );
      } else {
        await context.reply(`Os dados não foram enviados corretamente`);
      }
      return next();
    });
  }
}
