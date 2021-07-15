import LoginButton from "../LoginButton";
import "./style.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import Button from "../Button";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [shouldRedirectHome, setShouldRedirectHome] = useState(false);

  useEffect(() => {
    axios.get("/me").then((user) => {
      setIsLoggedIn(!!user.data);
    });
  }, []);

  const logout = () => {
    axios.get("/logout").then(() => {
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
        <div className="title">Skoip</div>
      </div>
      <div>{isLoggedIn && <Button text="Log out" clickHandler={logout} />}</div>
    </header>
  );
};

export default Header;
