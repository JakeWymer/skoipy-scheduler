import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Route, Redirect } from "react-router";
import { errorToast } from "./utils";

type AuthedRouteProps = {
  authedComponent: any;
  path: string;
};

const AuthedRoute = (props: AuthedRouteProps) => {
  const { authedComponent, path } = props;
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get("/me").then((res) => {
      if (!!res.data) {
        setIsAuthed(true);
        console.log(res.data);
      } else {
        errorToast("Please log in");
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div></div>;
  }

  if (!isAuthed) {
    return <Redirect to="/" />;
  }

  return <Route exact path={path} component={authedComponent} />;
};

export default AuthedRoute;
