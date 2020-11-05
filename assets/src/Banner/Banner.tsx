import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { Animated } from "react-animated-css";
import shouldForwardProp from "@styled-system/should-forward-prop";
import { space, flexbox, typography } from "styled-system";
import { Container } from "semantic-ui-react";
import { Header } from "../Header";
import HomePageModal from "../Modal/HomePageModal";

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

  img: {
    width: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "right",
    paddingLeft: "250px",
  },

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

const JFBanner = (props): JSX.Element => {
  return (
    <Container {...props}>
      <Animated
        animationInDelay={0}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        isVisible
      >
        <div className="leftHalf">
          <Header className="BannerHeader" as="h1" pt={200} pl={100}>
            Marvel
          </Header>
          <Header className="BannerHeader2" as="h2" pt={50} pl={100}>
            Super Hero Index
          </Header>
        </div>

        <div className="rightHalf">
          <HomePageModal />
          </div>
      </Animated>
    </Container>
  );
};

const JFBannerWithStyle = styled(JFBanner, {
        shouldForwardProp,
})(baseBannerStyles, space, flexbox, typography);

export default JFBannerWithStyle;
