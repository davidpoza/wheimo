import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

// own
import PrivateRoute from 'hocs/private-route';
import Content from 'components/content';
import HomeView from 'components/home-view';
import TagsView from 'components/tags-view';
import AccountsView from 'components/accounts-view';
import HeatmapView from 'components/heatmap-view';
import ChartView from 'components/chart-view';
import LoginView from 'components/login-view';
import AppBar from 'components/app-bar';
import useValidateUser from 'hooks/useValidateUser';
import './App.css';



const theme = createMuiTheme({
  "palette": {
    "type": "dark",
    "primary": {
      "light": "#7986cb",
      "main": "#7986cb",
      "dark": "#303f9f",
      "contrastText": "#fff"
    },
  }
});

function App({ user }) {
  useValidateUser();
  return (
    <div className="App" style={user?.theme === 'dark' ? { backgroundColor: '#121212', color: '#fff' } : {}}>
        <ThemeProvider theme={user?.theme === 'dark' ? theme : undefined}>
          <Router>
            <Content>
              <AppBar />
              <Switch>
                <Route path="/login" exact component={LoginView} />
                <PrivateRoute path="/" exact component={HomeView}/>
                <PrivateRoute path="/transactions/:id" exact component={HomeView}/>
                <PrivateRoute path="/tags" exact component={TagsView}/>
                <PrivateRoute path="/accounts" exact component={AccountsView}/>
                <PrivateRoute path="/heatmap" exact component={HeatmapView}/>
                <PrivateRoute path="/charts" exact component={ChartView}/>
                <PrivateRoute path="/drafts" exact onlyDrafts component={HomeView}/>
              </Switch>
            </Content>
          </Router>
        </ThemeProvider>

    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.current,
});

export default connect(mapStateToProps)(App);