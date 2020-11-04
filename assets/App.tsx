import "react-app-polyfill/ie11";
import React, { useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Banner from "./src/Banner/Banner";
import Nav from "./src/Navbar/Nav";
import Login from "./src/Login/Login";
import SignUp from "./src/SignUp/SignUp";
import Footer from "./src/Footer/Footer";
import fetcher from "./fetcher";

const Homepage = (): JSX.Element => {
  const [message, setMessage] = useState<string>("Frontend");
  console.log(setMessage);

  useEffect(() => {
    const fetchData = async () => {
      fetcher("http://localhost:8080/api/test").then(result => {
        setMessage(result);
      });
    };

    fetchData();
  });

  console.log(setMessage);
  return (
    <div>
      <Nav />
      <Banner />
      <pre>
        <code>{message && JSON.stringify(message, null, 4)}</code>
      </pre>{" "}
      <Login />
      <Footer />
    </div>
  );
};


const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Homepage} />
        <Route path="/Login" component={Login} />
        <Route path="/SignUp" component={SignUp} />
      </Switch>
    </Router>
  );
};

export default App;
