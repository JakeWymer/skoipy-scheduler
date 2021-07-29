import { useState } from "react";
import { useEffect } from "react";
import { Route, Redirect } from "react-router";
import ApiClient, { BaseApiResponse } from "./api";
import LoadingSpinner from "./components/LoadingSpinner";
import { warningToast } from "./utils";
import mixpanel from "mixpanel-browser";

type AuthedRouteProps = {
  authedComponent: any;
  path: string;
};

type User = {
  id: number;
  username: string;
  email: string;
};

export interface UserResponse extends BaseApiResponse {
  user: User;
}

export type AuthProps = {
  user: User;
};

const AuthedRoute = (props: AuthedRouteProps) => {
  const { path } = props;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    ApiClient.get<UserResponse>("/me").then((res) => {
      const user = res.user;
      if (!!user) {
        setUser(user);
        mixpanel.identify(user.id.toString());
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
