class AppState {
  constructor() {
    this.state = {};
    return this;
  }

  addState(state, member) {
    console.log(member);
    if (this.state[member] === undefined) {
      Object.assign(this.state, { [member]: state });
    } else {
      Object.assign(this.state[member], state);
    }
    console.log(`STATE ${Object.keys(state)} SETTED`);
    return this.state;
  }

  getState(state, member) {
    for (const stateToFind in this.state[member]) {
      if (stateToFind === state) {
        if (state === 'userRole') console.log(this.state[state]);
        console.log(`STATE ${stateToFind} FOUND IN ${member}, RETURNING THIS`);
        return this.state[member][stateToFind];
      }
    }
    return false;
  }
}

export default new AppState();
