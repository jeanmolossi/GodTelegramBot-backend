async function warnable(context, id) {
  try {
    const { status } = await context.telegram.getChatMember(
      context.message.chat.id,
      id
    );

    if (
      status === 'creator' ||
      status === 'administrator' ||
      status === 'left' ||
      status === 'kicked'
    ) {
      return false;
    }
  } catch (error) {
    return false;
  }
  return true;
}

function increase(warns, number) {
  if (number === null) number = 1;
  warns += number;
  if (warns > 3) {
    warns = 3;
  }

  return warns;
}

function decrease(warns, number) {
  if (number === null) number = 1;
  warns -= number;
  if (warns < 0) {
    warns = 0;
  }

  return warns;
}

async function memberInfo(context, chatid, userid) {
  const { user } = await context.telegram.getChatMember(chatid, userid);
  return user;
}

export async function warn(context, database, id, number, text) {
  if (!(await warnable(context, id))) {
    return 0;
  }

  let warns = await database.warnMethods.getWarns(context.message.chat.id, id);
  if (!warns) {
    warns = 0;
  }

  warns = increase(warns, number);
  console.log('Setting warns: ', warns);
  await database.warnMethods.setWarns(context.message.chat.id, id, warns);

  const { first_name } = await memberInfo(context, context.message.chat.id, id);
  await context.replyWithMarkdown(
    `Alerta de notificação!!!\nAo usuário:` +
      `[${first_name}](tg://user?id=${id}) (${warns} de 3)\nMotivo: ${text}`
  );

  if (warns >= 3) {
    try {
      await context.telegram.kickChatMember(context.message.chat.id, id);
    } catch (error) {
      return 1;
    }

    const parent_id = await database.warnMethods.getParent(
      context.message.chat.id,
      id
    );
    if (parent_id !== null && parent_id !== id) {
      return 1 + (await warn(context, database, parent_id, 1, 'Criança má!'));
    }
  }

  return 1;
}

export async function unwarn(context, database, id, number, text) {
  let warns = await database.warnMethods.getWarns(context.message.chat.id, id);
  if (!warns) warns = 0;

  warns = decrease(warns, number);
  await database.warnMethods.setWarns(context.message.chat.id, id, warns);
  const { first_name } = await memberInfo(context, context.message.chat.id, id);

  const { permissions, type } = await context.telegram.getChat(
    context.message.chat.id
  );

  if (type === 'supergroup') {
    context.telegram.restrictChatMember(
      context.message.chat.id,
      context.message.reply_to_message.from.id,
      permissions
    );
  }

  await context.replyWithMarkdown(`
Notificação de boa conduta:\n
Ao usuário: [${first_name}](tg://user?id=${id}) (${warns} de 3)
Motivo: ${text}
  `);

  return 1;
}
