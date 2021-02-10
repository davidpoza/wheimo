import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";

// own
import './App.css';
import PrivateRoute from './hocs/private-route';
import Navigation from './components/navigation';
import Content from './components/content';
import HomeView from './components/home-view';
import LoginView from './components/login-view';
import AppBar from './components/app-bar';
import store from './store';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Content>
          <Router>
            <AppBar />
            <Switch>
              <Route path="/login" exact component={LoginView} />
              <PrivateRoute path="/" exact component={HomeView}/>
            </Switch>
          </Router>
        </Content>
        <Navigation />
      </Provider>
    </div>
  );
}

export default App;
