import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
// own
import './App.css';
import PrivateRoute from './hocs/private-route';
import Content from './components/content';
import HomeView from './components/home-view';
import TagsView from './components/tags-view';
import AccountsView from './components/accounts-view';
import LoginView from './components/login-view';
import AppBar from './components/app-bar';
import store from './store';
import useValidateUser from 'hooks/useValidateUser';

function App() {
  useValidateUser();
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Content>
            <AppBar />
            <Switch>
              <Route path="/login" exact component={LoginView} />
              <PrivateRoute path="/" exact component={HomeView}/>
              <PrivateRoute path="/tags" exact component={TagsView}/>
              <PrivateRoute path="/accounts" exact component={AccountsView}/>
            </Switch>
          </Content>
        </Router>
      </Provider>
    </div>
  );
}

export default App
