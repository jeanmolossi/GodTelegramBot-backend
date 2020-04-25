import TelegrafInlineMenu from 'telegraf-inline-menu';

import EventEmitter from '../../../../../../store/EventEmitter';

const apiAdjust = new TelegrafInlineMenu(
  `Ajuste de configurações de API da Monetizze`
);

apiAdjust.urlButton(
  'Pegar meu Consumer Key de API',
  'https://app.monetizze.com.br/ferramentas/api'
);

apiAdjust.question('Enviar minha Consumer Key', 'sendck', {
  uniqueIdentifier: Math.floor(Math.random() * 100000).toString(),
  questionText: 'Qual a consumer key provida pela Monetizze?',
  setFunc: async (_ctx, answer) => {
    const userConfig = _ctx.message.from.id;
    EventEmitter.notify('apiConfig', {
      userConfig,
      apiCode: answer,
      context: _ctx,
    });
    // return answer;
  },
});

export default apiAdjust;
