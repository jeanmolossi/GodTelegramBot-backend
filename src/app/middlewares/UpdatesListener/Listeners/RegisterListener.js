import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';

export default class RegisterListener extends Composer {
  constructor(subject) {
    super();

    this.subject = subject;

    this.essentialData = {
      registerUrl: 'https://google.com',
      findProductCodeUrl: 'https://app.monetizze.com.br/loja',
    };

    this.action('register', this.register.bind(this));
    this.action('registerStart', this.registerStart.bind(this));
    this.action('cancel', this.cancel.bind(this));

    this.action('moreRegister', this.moreRegister.bind(this));

    this.action('whatsThatRegister', this.whatsThatRegister.bind(this));
    this.action('howToRegister', this.howToRegister.bind(this));
    this.action('panelRegister', this.panelRegister.bind(this));
  }

  async register(context, next) {
    if (!context.update.callback_query) return next();

    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `Certo, para registrar-se leia com atenção abaixo\n\n` +
          `Primeiro, tenha em mãos todos seus dados de\n\n` +
          `E-mail de compra,\nCódigo de compra e\nCódigo do produto\n\n` +
          `Após ter esses dados em mãos preciso que me envie da seguinte maneira:\n` +
          `/email seu@email.com\n\nAguarde minha confirmação e em seguida envie:\n` +
          `/compra 123456\n\nAssim que eu te confirmar que recebi seus dados prossiga com\n` +
          `/produto 123456\n\nApós identificar os dados enviados, prossiga com o registro...` +
          `\n\nPara encontrar o código do produto acesse pelo botão abaixo e busque pelo seu ` +
          `produto comprado.\nEm seguida acesse "Ver detalhes"\nE na descrição do produto encontre "Código do produto"`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            m.urlButton(
              'Onde conseguir o código do produto?',
              `${this.essentialData.findProductCodeUrl}`
            ),
          ])
        )
      );
      await context.reply(
        `Vamos começar ?`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('Sim!', 'registerStart')],
            [m.callbackButton('Cancelar', 'firstMenuStartAction')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
      return false;
    }
    return next();
  }

  async registerStart(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `Ok, pode começar. Me envie seu e-mail da forma que expliquei\n` +
          `/email seu@email.com`
      );
    } catch (error) {
      console.log(error);
    }
  }

  cancel(ctx, next) {
    // console.log('Canceled Action');
    return next();
  }

  async moreRegister(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `Qual sua dúvida sobre o registro ?`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('Que registro é esse?', 'whatsThatRegister')],
            [m.callbackButton('Como faço o registro?', 'howToRegister')],
            [m.callbackButton('Voltar', 'faq')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  async whatsThatRegister(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `É o registro necessário para que eu possa sincronizar sua conta ` +
          `com a sua compra. Dessa forma eu posso agilizar MUITO! seu atendimento\n` +
          `Assim você não fica esperando e consegue acesso, quase que imediato ao seu produto`,
        Extra.markup((m) =>
          m.inlineKeyboard([m.callbackButton('Voltar', 'moreRegister')])
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  async howToRegister(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `Você pode fazer seu registro de 2 formas:\n\n` +
          `1 - Direto comigo, aqui no privado, basta me enviar alguns dados.\n` +
          `2 - Direto no meu painel online. Mas para isso você precisará do seu Token\n`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [
              m.callbackButton(
                '1 - Fazer registro no PV com o Bot',
                'register'
              ),
            ],
            [m.callbackButton('2 - Fazer registro no painel', 'panelRegister')],
            [m.callbackButton('Voltar', 'moreRegister')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  async panelRegister(context, next) {
    const { message } = context.update.callback_query;
    if (!message) return next();
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `Você pode fazer seu registro direto no painel:\n\n` +
          `Para isso use o token:\n` +
          `${message.chat.id}\n`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [
              m.urlButton(
                'Fazer registro no painel',
                `${this.essentialData.registerUrl}`
              ),
            ],
            [m.callbackButton('Voltar', 'howToRegister')],
            [
              m.callbackButton(
                'Cancelar e voltar ao início',
                'firstMenuStartAction'
              ),
            ],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }
}
