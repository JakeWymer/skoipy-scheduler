import { Switch, Route } from "react-router-dom";
import AuthedRoute from "./AuthedRoute";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import GeneratorBuilder from "./pages/GeneratorBuilder";
import Settings from "./pages/Settings";

const Router = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <AuthedRoute path="/dashboard" authedComponent={Dashboard} />
      <AuthedRoute
        path="/generator/:generatorId/edit"
        authedComponent={GeneratorBuilder}
      />
      <AuthedRoute path="/generator/new" authedComponent={GeneratorBuilder} />
      <AuthedRoute path="/settings" authedComponent={Settings} />
    </Switch>
  );
};

export default Router;
