import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Nav from "./Navbar/Nav";
import Footer from "./Footer/Footer";
import CharacterPage from "./CharacterPage/CharacterPage";
import { GlobalStyle, Container } from "./layout/global-style";

const Homepage = (): JSX.Element => {
  return (
    <Container>
      <GlobalStyle />
      <Nav />
      <CharacterPage />
      <Footer />
    </Container>
  );
};

const App = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Homepage} />
      </Switch>
    </Router>
  );
};

export default App;