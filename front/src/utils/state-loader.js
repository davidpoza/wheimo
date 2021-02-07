class StateLoader {
  constructor() {
    this.loadState = this.loadState.bind(this);
    this.saveState = this.saveState.bind(this);
    this.initializeState = this.initializeState.bind(this);
  }

  loadState() {
    try {
      let serializedState = localStorage.getItem("wheimo_redux_store");

      if (serializedState === null) {
        return this.initializeState();
      }

      return JSON.parse(serializedState);
    }
    catch (err) {
      return this.initializeState();
    }
  }

  saveState(state) {
    try {
      let serializedState = JSON.stringify(state);
      localStorage.setItem("wheimo_redux_store", serializedState);
    }
    catch (err) {
    }
  }

  initializeState() {
    return {
      user: {}
    }
  };
}

export default StateLoader;