import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Router from "./Router";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <div className="content">
          <Router />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
