import React from "react";
import { Banner, Nav, Experience } from "../src";

export default {
  title: "Main",
};

export const Main = (): React.ReactElement => {
  return (
    <>
      <div>
        <Nav />
        <Banner />
        <Experience />
      </div>
    </>
  );
};
