import "react-app-polyfill/ie11";
import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Nav from "./src/Navbar/Nav";
import Footer from "./src/Footer/Footer";
import Banner from "./src/Banner/Banner";
import CharacterPage from "./src/CharacterPage/CharacterPage";
import SignUp from "./src/SignUp/SignUp";
import { GlobalStyle, Container } from "./src/layout/global-style";

const Homepage = (): JSX.Element => {
  return (
    <Container>
      <GlobalStyle />
      <Nav />
      <Banner />
      <Footer />
    </Container>
  );
};

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Homepage} />
        <Route path="/CharacterPage" component={CharacterPage} />
        <Route path="/SignUp" component={SignUp} />
      </Switch>
    </Router>
  );
};

export default App;
