import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// own
import './App.css';
import PrivateRoute from './hocs/private-route';
import Navigation from './components/navigation';
import Content from './components/content';
import HomeView from './components/home-view';
import LoginView from './components/login-view';

function App() {
  return (
    <div className="App">
      <Content>
        <Router>
          <Switch>
            <Route path="/login" exact component={LoginView} />
            <PrivateRoute path="/" exact component={HomeView}/>
          </Switch>
        </Router>
      </Content>
      <Navigation />
    </div>
  );
}

export default App;
