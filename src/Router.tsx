import { Switch, Route } from "react-router-dom";
import AuthedRoute from "./AuthedRoute";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import GeneratorBuilder from "./pages/GeneratorBuilder";

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
    </Switch>
  );
};

export default Router;
