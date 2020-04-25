import TelegrafInlineMenu from 'telegraf-inline-menu';

const apiAdjust = new TelegrafInlineMenu(
  `Ajuste de configurações de API da Monetizze`
);

apiAdjust.urlButton('Pegar meu Consumer Key de API', 'https://google.com');

apiAdjust.question('Enviar minha Consumer Key', 'sendConsumerKey', {
  uniqueIdentifier: Math.floor(Math.random() * 100000),
  questionText: 'Qual a consumer key provida pela Monetizze?',
  setFunc: (ctx, answer) => {
    console.log('CALLED', answer);
    return answer;
  },
});

export default apiAdjust;
