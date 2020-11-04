import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Animated } from 'react-animated-css';
import shouldForwardProp from '@styled-system/should-forward-prop';
import { space, flexbox, typography } from 'styled-system';
import { Container } from 'semantic-ui-react';
import { Header } from '../Header';
import { fleurimondColors } from '../theme';
import { Button } from '../Button';

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

  '.leftHalf': {
    width: '50%',
    display: 'inline-block'
  },
  '.rightHalf': {
    width: '50%',
    display: 'inline-block'
  },
  '*': {
    fontFamily: 'Montserrat, sans-serif'
  }
});

const JFSignUp = (props): JSX.Element => {
  return (
    <Container {...props}>
      <Animated
        animationInDelay={0}
        animationIn='slideInUp'
        animationOut='slideOutDown'
        isVisible>
        <Header className='BannerHeader' as='h1' pt={200} pl={100}>
          welcome
        </Header>
        <div className='leftHalf'>
          <Button
            variant='primary'
            aria-label='Primary Button'
            >
            Login
          </Button>
        </div>
        <div className='rightHalf'>
          <Button
            variant='primary'
            aria-label='Primary Button'
           >
            Sign Up
          </Button>
        </div>
      </Animated>
    </Container>
  );
};

const JFSignUpWithStyle = styled(JFSignUp, {
  shouldForwardProp
})(baseBannerStyles, space, flexbox, typography);

export default JFSignUpWithStyle;
