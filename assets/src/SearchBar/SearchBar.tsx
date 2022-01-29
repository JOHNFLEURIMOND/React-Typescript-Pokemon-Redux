import React, { useState, useEffect } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { Animated } from "react-animated-css";
import shouldForwardProp from "@styled-system/should-forward-prop";
import { space, flexbox, typography } from "styled-system";
import { Container } from "semantic-ui-react";
import { Header } from "../Header";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../Store";
import { GetMarvelCharacter } from "../actions/MarvelActions";

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
  const dispatch = useDispatch();
  const [marvelCharacterName, setMarvelCharacterName] = useState("");
  const [message, setMessage] = useState("");
  const marvelState = useSelector((state: RootStore) => state.pokemon);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setMarvelCharacterName(event.target.value);
  const handleSubmit = () => dispatch(GetMarvelCharacter(marvelCharacterName));
  console.log(setMessage);

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    const result = await fetch(
      "http://localhost:8080/backend/api"
    );
    const data = await result.json();
    console.log("data", data);

    setMessage(data);
  };

  console.log(setMessage)
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
            Pokemon
          </Header>
          <Header className="BannerHeader2" as="h2" pt={50} pl={100}>
            Moveset
          </Header>
        </div>

        <div className="rightHalf">
          <Container {...props}>
            <div className="jumbotron">

              <input
                onChange={handleChange}
              />
              <p> {message && JSON.stringify(message, null, 4)}</p>
              <button type="submit" onClick={handleSubmit}>
                {console.log("????")}
                submit
              </button>
              {marvelState.pokemon && (
                <div>
                  <img src={marvelState.pokemon.sprites.front_default} alt="" />
                  {marvelState.pokemon.abilities.map(ability => {
                    return <p>{ability.ability.name}</p>
                  })}
                </div>
              )}
            </div>
          </Container>
        </div>
      </Animated>
    </Container>
  );
};

const JFBannerWithStyle = styled(JFBanner, {
  shouldForwardProp,
})(baseBannerStyles, space, flexbox, typography);

export default JFBannerWithStyle;
