import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';

export default class UpdateListener extends Composer {
  constructor(database, subject) {
    super();
    this.subject = subject;
    this.database = database;

    this.subject.subscribe('registerDone', (payload) => {
      console.log(payload);
    });

    this.use(this.listenerActions.bind(this));
    this.action('faq', this.listenerTeste.bind(this));
    this.action('myCommands', this.myCommands.bind(this));
    this.action('register', this.register.bind(this));
    this.action('registerStart', async (context, next) => {
      await context.reply(
        `Ok, pode começar. Me envie seu e-mail da forma que expliquei`
      );
    });
    this.action('cancel', this.cancel.bind(this));
  }

  async listenerActions(context, next) {
    if (!context.update.callback_query) return next();
    // const { data } = context.update.callback_query;
    // console.log(context.update.callback_query.data);
    return next();
  }

  async listenerTeste(context, next) {
    if (!context.update.callback_query) return next();
    console.log(context.update.callback_query, 'ANSWER');
    await context.answerCbQuery();
    await context.reply(`Jáe`);
    return true;
  }

  async register(context, next) {
    if (!context.update.callback_query) return next();
    console.log(context.update.callback_query, 'ANSWER');
    await context.answerCbQuery();
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
    return true;
  }

  async myCommands(context, next) {
    await context.reply(
      `Qual comando você precisa?`,
      Extra.markup((m) =>
        m
          .keyboard([
            ['Registro', 'Meus dados'],
            ['Minhas compras', 'Meus alertas'],
            ['Meus grupos', 'Perguntas frequentes'],
          ])
          .oneTime()
          .resize()
      )
    );
  }

  cancel(ctx, next) {
    console.log('Canceled Action');
    return next();
  }
}
