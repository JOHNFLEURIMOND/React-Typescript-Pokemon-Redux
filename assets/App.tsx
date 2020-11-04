import "react-app-polyfill/ie11";
import React, { useState, useEffect } from "react";
import Banner from "./src/Banner/Banner";
import Nav from "./src/Navbar/Nav";
import Footer from "./src/Footer/Footer";
import Projects from "./src/Projects/Projects";
import fetcher from "./fetcher";

const App = (): JSX.Element => {
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
      <Projects />
      <Footer />
    </div>
  );
};

export default App;
