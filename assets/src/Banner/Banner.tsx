import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Animated } from 'react-animated-css';
import shouldForwardProp from '@styled-system/should-forward-prop';
import { space, flexbox, typography } from 'styled-system';
import { Container } from 'semantic-ui-react';
import { Header } from '../Header';
import { fleurimondColors } from '../theme';
import 'normalize.css';

const baseBannerStyles = css({
  boxSizing: 'border-box',
  minWidth: 0,
  fontSize: '1rem',
  color: fleurimondColors.black,
  lineHeight: 'normal',
  fontWeight: 600,
  margin: 0,
  padding: '0',
  height: '700px',
  width: '100%',
  backgroundColor: fleurimondColors.white,

  img: {
    width: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'right',
    paddingLeft: '250px',
  },

  '.leftHalf': {
    width: '50%',
    display: 'inline-block',
  },
  '.rightHalf': {
    width: '50%',
    display: 'inline-block',
  },
  '*': {
    fontFamily: 'Montserrat, sans-serif',
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
            Hi, My Name Is John Fleurimond
          </Header>
          <Header className="BannerHeader2" as="h2" pt={50} pl={100}>
            I’ve been honing my Javascript &amp; CSS skills for two years now
            and looking for a position where I can continue to exercise those
            skills and grow. Just a little glimpse into the type of engineer I
            am, I&apos;ve found that Front-End development is something that’s
            really important to me since I hope to take on more responsibilities
            in that position in the future. And As I continue to grow in that
            position, I would also love to grow in the Back End development. I’d
            love a position where I can use my skills to make an impact not only
            with the establishment that I&apos;m with but also with our clients.
            Also, being a part of a company where I can grow and work toward
            something I care about matters as well.
          </Header>
        </div>
        <div className="rightHalf" />
      </Animated>
    </Container>
  );
};

const JFBannerWithStyle = styled(JFBanner, {
  shouldForwardProp,
})(baseBannerStyles, space, flexbox, typography);

export default JFBannerWithStyle;
