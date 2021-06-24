import LoginButton from "../LoginButton";
import "./style.scss";

const Header = () => {
  return (
    <header>
      <div>
        <h1>Skoip</h1>
      </div>
      <div>
        <LoginButton />
      </div>
    </header>
  );
};

export default Header;
