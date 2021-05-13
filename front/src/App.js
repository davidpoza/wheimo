import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

// own
import './App.css';
import PrivateRoute from './hocs/private-route';
import Navigation from './components/navigation';
import Content from './components/content';
import HomeView from './components/home-view';
import TagsView from './components/tags-view';
import AccountsView from './components/accounts-view';
import LoginView from './components/login-view';
import AppBar from './components/app-bar';
import store from './store';
import usePushNotifications from './hooks/use-push-notification';

function App() {
  const { userSubscription } = usePushNotifications();
  console.log('--->', userSubscription);
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
          <Navigation />
        </Router>
      </Provider>
    </div>
  );
}

export default App;
