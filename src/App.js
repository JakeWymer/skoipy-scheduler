import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Router from "./Router";
import "./App.scss";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        {window.location.pathname !== "/" ? <Header /> : null}
        <div className="content">
          <Router />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
