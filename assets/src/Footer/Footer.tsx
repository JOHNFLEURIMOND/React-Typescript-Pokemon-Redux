import React, { useState } from "react";
import moment from "moment";
import styled from "styled-components";
import { fleurimondColors } from "../theme";
import { Link } from "react-router-dom";
import { Container } from "../layout/global-style";

export const Footer = styled.footer`
  width: 100%;
  height: 80px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  font-size: 1.4rem;
  background: linear-gradient(
    90deg,
    ${fleurimondColors.buttons.blue} 0%,
    ${fleurimondColors.leapingLemon} 85%
  );
  padding: 20px;
`;

export const FooterContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  width: 100%;
`;

export const FooterLogo = styled(Link)`
  color: ${fleurimondColors.white};
  cursor: pointer;
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 1.4rem;
  font-weight: 800;
  transition: all 0.5s ease;
  &:hover,
  &:active,
  &:focus {
    border-color: ${fleurimondColors.white};
    color: ${fleurimondColors.white};
    transform: scale(1.08);
  }
`;

export const MenuIcon = styled.div`
  display: none;
  @media (max-width: 1000px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-50%, 20%);
    font-size: 1.4rem;
    cursor: pointer;
  }
`;

export const Menu = styled.ul`
  display: flex;
  align-items: center;
  text-align: center;
  width: 100vw;
  flex-direction: row;
  justify-content: space-around;
  margin: 2%;
  liststyle: none;
  @media only screen and (max-width: 1000px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 80px;
    left: ;
    background-color: rgba(0, 0, 0, 0.9);
    transition: all 0.5s ease;
  }
`;

export const MenuItem = styled.li`
  list-style: none;
  height: 80px;
  @media only screen and (max-width: 1000px) {
    width: 100%;
    &:hover {
      border: none;
    }
  }
`;

export const MenuLink = styled(Link)`
  text-decoration: none;
  font-weight: bold;
  font-size: 1.5rem;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  height: 100%;
  transition: all 0.2s ease;
  &:hover {
    color: ${fleurimondColors.palesasAqua};
    transform: traslateY(-3rem);
  }
  &:active {
    transform: traslateY(3rem);
    color: ${fleurimondColors.palesasAqua};
  }
  @media only screen and (max-width: 1000px) {
    display: block;
    padding: 3rem;
    text-align: center;
    transition: all 0.2s ease;
  }
`;

export const MenuItemBtn = styled.li`
  list-style: none;
  @media screen and (max-width: 1000px) {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 120px;
  }
`;

export const MenuLinkBtn = styled(Link)`
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  height: 100%;
  width: 100%;
  border: none;
  outline: none;
`;

const JFFooter = (props) => {
  //click is the initial state and setclick will be the update state
  const [click, setClick] = useState(false);

  //Create a function to handle the click state of the menu icon.
  //if the menu icon was the menu bar at the beginning when clicked it will have the close icon
  const handleClick = () => setClick(!click);

  return (
    <Footer {...props}>
      <FooterLogo to="/">
        <MenuIcon />
        Fleurimond
      </FooterLogo>

      <Menu>
        <MenuItem>
          <MenuLink onClick={handleClick} to="/">
            {moment().format("llll")}
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink onClick={handleClick} to="https://twitter.com/TCODEMONGER">
            Twitter
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink
            onClick={handleClick}
            to="https://github.com/JOHNFLEURIMOND"
          >
            Github
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink
            onClick={handleClick}
            to="https://www.linkedin.com/in/john-fleurimond"
          >
            LinkedIn
          </MenuLink>
        </MenuItem>
      </Menu>
    </Footer>
  );
};

export default JFFooter;
