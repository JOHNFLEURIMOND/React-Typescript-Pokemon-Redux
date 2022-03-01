import React, { useState } from "react";
import { Animated } from "react-animated-css";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../Store";
import { GetPokemonCharacter } from "../actions/PokemonActions";
import styled from "styled-components";
import {
  Dimmer,
  Loader,
  Image,
  Segment,
  Button,
  Input,
  Icon,
} from "semantic-ui-react";
import md5 from "js-md5";
import uid2 from "uid2";
import { Header } from "../Header";
import { Card } from "../Card";

import { fleurimondColors } from "../theme";

export const ProjectsSectionContainer = styled.div`
  justify-items: center;
  align-items: center;
  grid-gap: 1rem;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  font-size: 1rem;
  text-align: center;
  font-weight: 500;
  margin: 0;
  padding: 2em;
  line-height: normal;
  background-color: ${fleurimondColors.white};

  @media (max-width: 800px) {
    width: 100%;
    min-height: 100vh;
    box-sizing: border-box;
    margin: 0;
    padding: 2em;
    grid-gap: 10px;
    justify-items: center;
    align-items: center;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    grid-template-rows: repeat(auto-fit, minmax(350px, 1fr));
  }
  @media (max-width: 400px) {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    margin: 0;
    padding: 2em;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(auto-fit, minmax(350px, 1fr));
    grid-gap: 10px;
    justify-items: center;
    align-items: center;
  }
`;

export const CardDiv = styled.div`
  grid-column: span 3;
`;
export const CineDiv = styled.div`
  display: block;
`;

export const Link = styled.a`
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  color: ${fleurimondColors.black};
`;

export const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 30px;

  div {
    font-size: 18px;
    margin-right: 5px;
  }

  span {
    font-size: 15px;
    font-weight: 500;
  }

  @media (max-width: 400px) {
    display: none;
  }
`;

export const Divie = styled.div`
  display: block;
`;

export const Hamburger = styled.span`
  width: 32px;
  height: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
`;

export const Bolt = styled.span`
  position: relative;
  margin: 50px;
  width: 30px;
  height: 50px;
  transform-origin: 50% 50%;
  transform: skewX(-30deg) skewY(-30deg) rotate(10deg);
  background-color: yellow;
  padding: 0;
  margin-left: 0;
  margin-right: 0;

  &:before {
    position: absolute;
    border-style: solid;
    border-width: 0 0 10px 5px;
    border-color: transparent transparent ${fleurimondColors.graySmoke}
      transparent;
    top: 0px;
    left: -11px;
    padding: 0;
    margin: 0;
    content: "";
  }

  &:after {
    display: inline-block;
    position: absolute;
    border-style: solid;
    border-width: 0 0 10px 5px;
    border-color: transparent transparent transparent
      ${fleurimondColors.graySmoke};
    bottom: 0px;
    right: 3px;
    content: "";
  }
`;
export const FlippedCardInfoFieldset = styled.span`
  color: ${fleurimondColors.smoke};
  display: block;
  font-size: 15px;
  width: 100%;
  font-family: "proxima-nova", "sans-serif";
  font-weight: 500;
  position: relative;
  padding: 0 10px;
  margin: 5px;
`;

const JFBanner = (props): JSX.Element => {
  const [card, flipCard] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [pokemonlCharacterName, setPokemonCharacterName] = useState<string>("");
  const marvelState = useSelector((state: RootStore) => state.pokemon);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPokemonCharacterName(event.target.value);
  const handleSubmit = () =>
    dispatch(GetPokemonCharacter(pokemonlCharacterName));
  let UID = uid2(8);
  let keyNumber = md5(UID);
  if (!marvelState) {
    return (
      <div>
        <Segment>
          <Dimmer active>
            <Loader size="massive">....API Data Is Loading....</Loader>
          </Dimmer>
          <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
          <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
          <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
          <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
        </Segment>
      </div>
    );
  }

  return (
    <ProjectsSectionContainer {...props}>
      <Animated
        animationInDelay={0}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        isVisible
      >
        <Divie>
          <Header>Pokemon Characters</Header>
          <Input
            style={{ margin: " 2rem 0", padding: "2rem 0" }}
            size="large"
            onChange={handleChange}
          />
          <Button
            variant="primary"
            aria-label="Primary Small Button"
            type="submit"
            onClick={handleSubmit}
          >
            submit
          </Button>
        </Divie>
      </Animated>

      <Animated
        animationInDelay={0}
        animationIn="fadeInLeft"
        animationOut="fadeOutRight"
        isVisible
      >
        <CineDiv>
          {marvelState.pokemon && (
            <div>
              {marvelState.pokemon.abilities.map((ability) => {
                return card ? (
                  <div>
                    <Card key={keyNumber} onClick={() => flipCard(false)}>
                      <Card.Content>
                        <Image
                          src={marvelState.pokemon.sprites.front_default}
                          wrapped
                          ui={true}
                        />
                      </Card.Content>
                      <Card.Content>
                        <Card.Header>{ability.ability.name}</Card.Header>
                        <Card.Description></Card.Description>
                      </Card.Content>
                      <Card.Content extra>
                        <a>
                          <Icon name="user" />
                        </a>
                      </Card.Content>
                    </Card>
                  </div>
                ) : (
                  <div>
                    <Card key={keyNumber} onClick={() => flipCard(true)}>
                      <Card.Content>
                        <Image
                          src={marvelState.pokemon.sprites.front_shiny}
                          wrapped
                          ui={true}
                        />
                      </Card.Content>
                      <Card.Content>
                        <Card.Header></Card.Header>
                        <Card.Description></Card.Description>
                      </Card.Content>
                      <Card.Content extra>
                        <a>
                          <Icon name="user" />
                        </a>
                      </Card.Content>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </CineDiv>
      </Animated>
    </ProjectsSectionContainer>
  );
};

export default JFBanner;
