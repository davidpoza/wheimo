import Config from 'utils/config';

class StateLoader {
  constructor() {
    this.loadState = this.loadState.bind(this);
    this.saveState = this.saveState.bind(this);
    this.initializeState = this.initializeState.bind(this);
  }

  loadState() {
    try {
      const serializedState = localStorage.getItem(Config.LOCALSTORAGE_KEY);

      if (serializedState === null) {
        return this.initializeState();
      }

      return JSON.parse(serializedState);
    } catch (err) {
      return this.initializeState();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  saveState(state) {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(Config.LOCALSTORAGE_KEY, serializedState);
    } catch (err) {
      console.log(err);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  initializeState() {
    return {
      user: {},
    };
  }
}

export default StateLoader;
