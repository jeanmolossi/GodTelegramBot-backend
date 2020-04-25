import TelegrafInlineMenu from 'telegraf-inline-menu';

const ObjOfDescritions = {
  // DEFAULT MEMBER && VIP MEMBER COMMANDS
  Start:
    'Comando /start é completamente intuitivo. Apenas começa o dialogo com o bot',
  Staff:
    `Com o comando /staff você recebe uma lista de todos usuários da equipe ` +
    `de moderação do grupo`,
  Help:
    'Comando /help é completamente intuitivo. Apenas começa o dialogo de Ajuda com o bot',
  // HELPER ROLE COMMANDS
  Del:
    `O Comando /del é muito simples.\nServe apenas para apagar a mensagem ` +
    `de todos os registros. Ela não aparecerá para ninguém mais`,
  Logdel:
    `O Comando /logdel é muito simples.\nServe apenas para apagar a mensagem ` +
    `de todos os registros. Ela não aparecerá para ninguém mais.\n\n` +
    `O /logdel tem um adicional de salvar a mensagem antes de exluí-la`,
  // SOBMODERATOR ROLE COMMANDS
  Warn:
    `O Comando /warn serve para notificar um usuário que está se comportando ` +
    `contra a conduta do grupo. Você pode atribuir 1, 2 ou 3 pontos de alerta ` +
    `\n\nO usuário que atingir 3 pontos de alerta será punido conforme os ` +
    `Administradores definiram\n\nModo de uso: \nResponda à mensage do usuário ` +
    `que deseja alertar, da seguinte forma: \n/warn 1\n\nDessa forma você atribuirá ` +
    `1 ponto de alerta ao usuário`,
  Unwarn:
    `O Comando /unwarn é o oposto do comando /warn.\nServe para remover ` +
    `pontos atribuidos anteriormente à usuários.\n\n` +
    `Modo de Uso:\nResponda à mensagem do usuário que deseja remover ` +
    `os pontos de alerta da seguinte forma:\n/unwarn 1\n\nDessa forma ` +
    `você irá remover 1 ponto de alerta do usuário.`,
  // MODERATOR ROLE COMMANDS
  Info:
    `O Comando /info serve para que você receba pequeno relatório sobre ` +
    `o usuário.\n\n` +
    `Modo de Uso:\nResponda à mensagem do usuário que deseja receber ` +
    `o relatório, da seguinte forma:\n/info\n\nDessa forma ` +
    `você irá receber o relatório do usuário que enviou a mensagem ` +
    `a qual você respondeu.`,
  Mute:
    `O Comando /mute serve para mutar um usuário que, geralmente, está abusando ` +
    `no envio de mensagens. ` +
    `\n\nModo de uso: \nResponda à mensage do usuário ` +
    `que deseja mutar, da seguinte forma: \n/mute 15\n\nDessa forma você atribuirá ` +
    `15 minutos de punição ao usuário. O qual não poderá enviar mensagens nesse período`,
  Notificacoes:
    `O Comando /notificacoes serve para que eu reúna as notificações destinadas ` +
    `à você. Geralmente tickets de suporte ou atualizações de sistema ou grupo.\n\n` +
    `Modo de Uso:\n/notificacoes `,
  // ADMINISTRATOR ROLE COMMANDS
  Ban:
    `O Comando /ban serve para banir completamente um usuário. Este comando ` +
    `funciona *SOMENTE EM SUPERGRUPOS*. Após o usuário ser banido ele só retornará ` +
    `ao grupo após receber /unban ou ser _Manualmente_ adicionado ao grupo.\n\n` +
    `Modo de uso:\nResponda à mensagem do usuário que você deseja banir com o comando\n` +
    `/ban`,
  Unban:
    `O Comando /unban é o oposto do comando /ban. Este comando ` +
    `funciona *SOMENTE EM SUPERGRUPOS*. Após o usuário ser banido ele só retornará ` +
    `ao grupo após receber /unban ou ser _Manualmente_ adicionado ao grupo.\n\n` +
    `Modo de uso:\nResponda à mensagem do usuário que você deseja desbanir com o comando\n` +
    `/unban`,
  Kick:
    `O comando /kick serve para expulsar o usuário do grupo. Porém, é possível ` +
    `que ele retorne utilizando o link de convite do chat.\n\nModo de uso:\n` +
    `Responda à mensagem do usuário que você deseja expulsar com o comando ` +
    `/kick`,
  Reload:
    `O reload é utilizado para reinicializar o bot no grupo, caso tenha ` +
    `ocorrido algum erro ou o bot não inicializou da maneira correta.\n` +
    `É recomendado utilizar esse comando toda vez que for criado um novo grupo.\n\n` +
    `Modo de uso:\n/reload`,
  Settings:
    `O comando /settings serve, basicamente, para ajustar as configurações ` +
    `do grupo. Habilitar ou desabilitar filtros e regras pré-definidas\n\n` +
    `Modo de uso:\n/settings`,
  Freeuser:
    `O comando /freeuser deve ser usado em resposta à mensagem do usuário ` +
    `correspondente. O qual você deseja promover à FreeUser ou Usuário livre.\n\n` +
    `Usuário livre *NÃO* sofre Moderação automática do bot`,
  Helper:
    `O comando /helper deve ser usado em resposta à mensagem do usuário ` +
    `correspondente. O qual você deseja promover à Helper ou Usuário ajudante.\n\n` +
    `Usuário ajudante possui o direito de apagar e/ou salvar em Log mensagens`,
  SubModerador:
    `O comando /submoderador deve ser usado em resposta à mensagem do usuário ` +
    `correspondente. O qual você deseja promover à SubModerador.\n\n` +
    `Usuário SubModerador possui alguns comandos a mais e faz parte da Staff do grupo.\n\n` +
    `Portanto. O usuário que é SubModerador pode alertar e remover alertas de usuários`,
  Moderador:
    `O comando /moderador deve ser usado em resposta à mensagem do usuário ` +
    `correspondente. O qual você deseja promover à Moderador.\n\n` +
    `Usuário Moderador possui alguns mais comandos e também faz parte da Staff do grupo.\n\n` +
    `Dessa forma, o usuário que é Moderador pode receber também notificações de suporte`,
  Demote:
    `O comando /demote deve ser usado em resposta à mensagem do usuário ` +
    `correspondente. O qual você deseja /rebaixar* à Usuário padrão.\n\n` +
    `Este comando não expulsa do grupo. Apenas limita as funcionalidades disponíveis ` +
    `ao usuário "demotado" / rebaixado`,
  // CO-FOUNDER ROLE COMMANDS
  Administrador:
    `O comando /administrador deve ser usado em resposta à mensagem do usuário ` +
    `correspondente. O qual você deseja promover à Administrador.\n\n` +
    `Usuário Administrador possui maiores responsabilidades como parte da Staff do grupo.\n\n` +
    `Esse título de Staff habilita para o Usuário uma série de comandos para moderação ` +
    `e controle do grupo. Este usuário, geralmente é o braço direito do Fundador e Co Fundador`,
  CoFundador:
    `O comando /cofundador promove o usuário ao qual você responder a mensagem com o comando ` +
    `à CoFundador do grupo. Trazendo grandes responsabilidades na Staff do Grupo e uso do Bot`,
  // FOUNDER ROLE COMMANDS
  // THIS HAVE ALL ACCEPTED COMMANDS UP
};

const loadDescription = async ctx => {
  const commandSelected = ctx.match[3];
  return ObjOfDescritions[commandSelected];
};

const command = new TelegrafInlineMenu(loadDescription);

export default command;
