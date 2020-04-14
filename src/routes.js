import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom"; //O Redirect não está sendo usado por enquanto adicionar depois(//Redirect //)
import Login from './pages/login/Login';
import { isAuthenticated, hasPermission } from "./services/auth";
import Topbar from "./components/topbar/Topbar";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme/SystemTheme";
import TopbarLinks from "./configs/TopbarLinks";
import rules from './configs/TopbarLinks'

const PrivateRoute = ({ component: Component, profile, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() && hasPermission(profile) ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
    }
  />
);

const Routes = () => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
    <Route path="/">
      <Topbar links={TopbarLinks} />
    </Route>
      <Switch>
        <Route exact path="/" component={Login} />        
        {rules.map((item) => (<PrivateRoute key={item} profile={item.perfil} path={item.path} component={item.component} />))}
                <Route path="*" component={() => <h1>Page not found</h1>} />
      </Switch>
    </BrowserRouter>
  </ThemeProvider>
);

export default Routes;