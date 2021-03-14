import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
// Import TinyMce
import 'tinymce';

// Default Icons
import 'tinymce/icons/default';

// Theme
import 'tinymce/themes/silver';

// Plugins
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/textpattern';

// CSS
import 'tinymce/skins/ui/oxide/skin.min.css';

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
