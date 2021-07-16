import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Route, Redirect } from "react-router";
import LoadingSpinner from "./components/LoadingSpinner";
import { warningToast } from "./utils";

type AuthedRouteProps = {
  authedComponent: any;
  path: string;
};

type User = {
  id: number;
  username: string;
  email: string;
};

export type AuthProps = {
  user: User;
};

const AuthedRoute = (props: AuthedRouteProps) => {
  const { authedComponent, path } = props;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get("/me").then((res) => {
      const user = res.data;
      if (!!user) {
        setUser(user);
      } else {
        warningToast("Please log in");
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Redirect to="/" />;
  }

  return (
    <Route exact path={path}>
      <props.authedComponent user={user} />
    </Route>
  );
};

export default AuthedRoute;
