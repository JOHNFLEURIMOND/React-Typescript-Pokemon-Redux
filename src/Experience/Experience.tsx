/* eslint-disable global-require */
import React, { useState } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import shouldForwardProp from "@styled-system/should-forward-prop";
import { space, flexbox, typography } from "styled-system";
import { Container } from "semantic-ui-react";
import { Header } from "../Header";
import { Card } from "../Card";
import { Button } from "../Button";
import { fleurimondColors } from "../theme";

type CardVariation = "frontEnd" | "backEnd";

export interface JFCardProps {
  variant?: CardVariation;
}

const baseExperienceStyles = css({
  boxSizing: "border-box",
  minWidth: 0,
  color: fleurimondColors.black,
  lineHeight: "normal",
  fontWeight: 600,
  height: "auto",
  width: "100vw",
  backgroundColor: fleurimondColors.haitianGold,
  overflowX: "hidden",

  ".ExperienceHeader": {
    width: "100%",
    fontSize: "2rem",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    margin: "0 3rem 0 0",
  },
  ".ExperienceHeader1": {
    width: "50%",
    fontSize: "2rem",
    textAlign: "center",
    justifyContent: "center",
    display: "flex",
    "&:hover,&:active,&:focus": {
      borderColor: fleurimondColors.buttons.darkBlue,
      color: fleurimondColors.white,
    },
  },
  ".ExperienceHeader2": {
    width: "50%",
    fontSize: "2rem",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    "&:hover,&:active,&:focus": {
      borderColor: fleurimondColors.buttons.darkBlue,
      color: fleurimondColors.white,
    },
  },
  svg: {
    "&:hover,&:active,&:focus": {
      borderColor: fleurimondColors.buttons.darkBlue,
      color: fleurimondColors.white,
    },
  },

  ".Experience": {
    display: "flex",
  },
  "*": {
    fontFamily: "Montserrat, sans-serif",
  },
  div: {
    display: "inline-block",
  },
  ".resume": {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    margin: "4rem",
  },
  a: {
    textDecoration: "none",
    color: fleurimondColors.white,
  },
  ".backend": {
    display: "none !important",
  },
  ".backendShow": {
    display: "block !important",
  },
  ".fullstack-toggle": {
    display: "block",
    width: "100%",
  },
  ".halves": {
    width: "26%",
    padding: "0px 7% 0 17%",
  },
  ".toggleCard": {
    display: "flex",
    justifyContent: "center",
  },
  ".Skills-container": {
    display: "block",
    justifyContent: "center",
    width: "88rem",
    margin: "0px 2%",
  },
});

const JFBanner = (props): JSX.Element => {
  const [unSetDivMenu, setDivMenu] = useState<boolean>(false);

  return (
    <Container {...props}>
      <Header className="ExperienceHeader" as="h1" pt={100}>
        Experience
      </Header>
      <div className="fullstack-toggle">
        <div className="halves">
          <Header className="ExperienceHeader1" as="h1" mt={50}>
            Front End
          </Header>
        </div>
        <div className="halves">
          <Header
            className="ExperienceHeader2"
            as="h1"
            mt={50}
            onMouseEnter={(): void => setDivMenu(true)}
            onMouseLeave={(): void => setDivMenu(false)}
          >
            Back End
          </Header>
        </div>
      </div>
      <div className="toggleCard">
        {unSetDivMenu ? (
          <Card className="backend backendShow">
            <Card.Content>
              <Card.Header>Back End</Card.Header>

              <Card.Description>
                As I continue to grow in as an Engineer, I would also love to
                grow in the Back End development so I can be more proficient
                become better being a Full-stack Developer. I have experience
                with relational and non-relational databases using promgramming
                langanuages, Node & Express to develop CRUD applications.
              </Card.Description>
            </Card.Content>
            <Card.Content extra>2+ years</Card.Content>
          </Card>
        ) : (
          <Card>
            <Card.Content>
              <Card.Header>Front End</Card.Header>

              <Card.Description>
                I do my best to embower the designer and prevent techinical
                constrants from composing user experince. Developing a simple
                single static to a complex web-based internet applications with
                responsive resuable components. Leverage developer workflow
                tools such as Jenkins, Docker, Git, Slack, JIRA and Confluence
              </Card.Description>
            </Card.Content>
            <Card.Content extra>2+ years</Card.Content>
          </Card>
        )}
      </div>
      <div className="resume">
        <Button variant="primary" aria-label="Primary Small Button" mt={50}>
          Download Resume
        </Button>
      </div>
    </Container>
  );
};

const JFExperienceWithStyle = styled(JFBanner, {
  shouldForwardProp,
})(baseExperienceStyles, space, flexbox, typography);

export default JFExperienceWithStyle;
