import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Router from "./Router";
import "./App.scss";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <div className="content">
          <Router />
          <ToastContainer />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
