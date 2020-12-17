import {
  Card,
  Container,
  Card as SUICard,
  CardProps as SUICardProps,
} from "semantic-ui-react";
import React, { useState, useEffect } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import shouldForwardProp from "@styled-system/should-forward-prop";
import { space, flexbox, typography } from "styled-system";
import axios from "Axios";

import { fleurimondColors } from "../theme";

const baseProjectCardsStyles = css({
  width: "1127px",
  marginLeft: "10% !important",
  marginRight: "10% !important",
  ".card": {
    margin: "1rem",
    padding: "1rem",
    backgroundColor: fleurimondColors.white,
    borderRadius: ".28571429rem",
    display: "inline-block",
    boxShadow: "1px 3px 3px #000000",

    img: {
      display: "block",
      width: "100%",
      height: "150px",
      borderRadius: "inherit",
    },
    ".content": {
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      color: fleurimondColors.modals.text,
      fontWeight: "normal",
      display: "block",
      fontSize: "14px",
      lineHeight: "normal",
      padding: "20px 17px 0 17px",
      paddingBottom: 0,
      overflowY: "auto",
      flex: "1 1 auto",
    },
    ".header": {
      fontFamily: "Montserrat, Helvetica, Arial, sans-serif",
      color: fleurimondColors.trueBlack,
      lineHeight: "normal",
      fontWeight: "bold",
      borderBottomWidth: "1px",
      borderBottomStyle: "solid",
      borderBottomColor: fleurimondColors.modals.innerBorders,
      fontSize: "16px",
      padding: "0.94rem",
      marginBottom: 0,
      flex: "0 0 auto",
    },
  },
});

const JFProjectCards = (props: SUICardProps): JSX.Element => {
  interface MarvelCharacters {
    id?: number;
    name: string;
    description: string;
    thumbnail: any;
  }

  const marvelProps: MarvelCharacters[] = [];

  const [characters, setCharacters]: [
    MarvelCharacters[],
    (results: MarvelCharacters[]) => void
  ] = useState(marvelProps);

  useEffect(() => {
    getMarvelCharacters();
  }, []);

  const getMarvelCharacters = async () => {
    await axios.get("http://localhost:8080/backend/api").then((response) => {
      setCharacters(response.data.data.results);
      console.log(response.status);
      console.log(response.statusText);
      console.log(response.headers);
      console.log(response.config);
    });
  };

  return (
    <Container style={{ display: "inline-block" }} {...props}>
      {characters &&
        characters.map((characters) => (
          <div style={{ display: "inline-block" }} key={characters.id}>
            <Card.Group itemsPerRow={4}>
              <SUICard
                image={`${characters.thumbnail.path}/portrait_fantastic.${characters.thumbnail.extension}`}
                header={characters.name}
                description={characters.description}
              />
            </Card.Group>
          </div>
        ))}
    </Container>
  );
};

const JFProjectCardsWithStyle = styled(JFProjectCards, {
  shouldForwardProp,
})(baseProjectCardsStyles, space, flexbox, typography);

export default JFProjectCardsWithStyle;
