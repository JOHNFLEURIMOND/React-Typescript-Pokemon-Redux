import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { Animated } from "react-animated-css";
import shouldForwardProp from "@styled-system/should-forward-prop";
import { space, flexbox, typography } from "styled-system";
import { Container } from "semantic-ui-react";
import Nav from "../Navbar/Nav";
import Footer from "../Footer/Footer";
import SearchBar from "../SearchBar/SearchBar";
import Projects from "../Projects/Projects";
import { fleurimondColors } from "../theme";

const baseBannerStyles = css({
  boxSizing: "border-box",
  minWidth: 0,
  fontSize: "1rem",
  color: fleurimondColors.black,
  lineHeight: "normal",
  fontWeight: 600,
  margin: 0,
  padding: "0",
  height: "700px",
  width: "100%",
  backgroundColor: fleurimondColors.white,

  ".leftHalf": {
    width: "50%",
    display: "inline-block",
  },
  ".rightHalf": {
    width: "50%",
    display: "inline-block",
  },
  "*": {
    fontFamily: "Montserrat, sans-serif",
  },
});

const JFCharacterCards = (props): JSX.Element => {
  return (
    <Container {...props}>
      <Nav />

      <Animated
        animationInDelay={0}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        isVisible
      >
        <SearchBar />
        <Projects />
      </Animated>
      <Footer />
    </Container>
  );
};

const JFCharacterCardsWithStyle = styled(JFCharacterCards, {
  shouldForwardProp,
})(baseBannerStyles, space, flexbox, typography);

export default JFCharacterCardsWithStyle;