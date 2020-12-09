import React from "react";
import { Header } from "../src/Header";

export default {
  title: "Header",
};

export const Sizes = (): React.ReactElement => (
  <>
    <Header as="h1" mb={3}>
      Header Sizes
    </Header>
    <Header as="h1" mb={2}>
      Header Level One
    </Header>
    <Header as="h2" mb={2}>
      Header Level Two
    </Header>
    <Header as="h3" mb={2}>
      Header Level Three
    </Header>
    <Header as="h4" mb={2}>
      Header Level Four
    </Header>
    <Header as="h5" mb={2}>
      Header Level Five
    </Header>
    <Header as="h6" mb={2}>
      Header Level Six
    </Header>
  </>
);
