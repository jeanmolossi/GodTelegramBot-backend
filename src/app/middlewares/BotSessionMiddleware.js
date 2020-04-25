import Composer from 'telegraf/composer';
import LocalSession from 'telegraf-session-local';

import { subMinutes, parseISO, format, getUnixTime } from 'date-fns';

class SessionMiddleware extends Composer {
  constructor() {
    super();

    this.localSession = new LocalSession({
      storage: LocalSession.storageMemory,
      property: 'appState',
    }).middleware();

    this.use(this.localSession);
    this.use(this.clearMemo.bind(this));
    this.use(this.addUtils.bind(this));

    return this;
  }

  async clearMemo(context, next) {
    context.appState.createdAt =
      context.appState.createdAt ||
      format(new Date().getTime(), "yyyy-MM-dd'T'HH:mm:ssxxx");

    const compareDate = parseISO(context.appState.createdAt);
    const validDate = parseISO(
      format(subMinutes(new Date().getTime(), 15), "yyyy-MM-dd'T'HH:mm:ssxxx")
    );

    const unixAppState = getUnixTime(compareDate);
    const unixValidDate = getUnixTime(validDate);

    if (unixAppState < unixValidDate) context.appState = null;
    return next();
  }

  addUtils(context, next) {
    context.appState.utils = {
      addToState(state) {
        const newState = Object.assign(context.appState, state);
        context.appState = newState;
        // console.log('SETTING STATE>>', state);
        return context.appState;
      },
      getState(key) {
        for (const state in context.appState) {
          if (state === key) {
            console.log('RETURNING>>', state);
            return context.appState[state];
          }
        }
        return undefined;
      },
    };
    // console.log(
    //   context.appState,
    //   'BOT SESSION MIDDLEWARE APP STATE >> addUtils'
    // );
    return next();
  }
}

export default new SessionMiddleware();
