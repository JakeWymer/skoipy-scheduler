import "./style.scss";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../Button";
import ApiClient from "../../api";
import { UserResponse } from "../../AuthedRoute";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [shouldRedirectHome, setShouldRedirectHome] = useState(false);

  useEffect(() => {
    ApiClient.get<UserResponse>("/me").then((res) => {
      setIsLoggedIn(!!res.user);
    });
  }, []);

  const logout = () => {
    ApiClient.get(
      "/logout",
      `There was a problem logging out.`,
      `Successfully logged out!`
    ).then(() => {
      setShouldRedirectHome(true);
    });
  };

  if (shouldRedirectHome) {
    window.location.href = "/";
    setShouldRedirectHome(false);
  }
  return (
    <header>
      <div>
        <Link to={isLoggedIn ? "/dashboard" : "/"}>
          <div className="title">Skoip</div>
        </Link>
      </div>
      <div>{isLoggedIn && <Button text="Log out" clickHandler={logout} />}</div>
    </header>
  );
};

export default Header;
