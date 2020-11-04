import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import shouldForwardProp from '@styled-system/should-forward-prop';
import { space, flexbox, typography } from 'styled-system';
import { Container } from 'semantic-ui-react';
import moment from 'moment';

import { fleurimondColors } from '../theme';

const baseFooterStyles = css({
  boxSizing: 'border-box',
  fontSize: '20px',
  height: '55px',
  textAlign: 'center',
  width: '100%',
  backgroundColor: fleurimondColors.black,
  minHeight: '8vh',
  display: 'flex',
  padding: '20px',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  left: 0,
  bottom: 0,

  a: {
    textDecoration: 'none',
    color: fleurimondColors.woooRed,
    '&:hover,&:active,&:focus': {
      borderColor: fleurimondColors.white,
      color: fleurimondColors.white,
    },
  },
  ul: {
    width: '52vw',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: '2%',
    listStyle: 'none',
  },
});

const JFProjects = (props): JSX.Element => {
  return (
    <Container {...props}>
      <footer>
        <div className="App-footer">
          <ul>
            <li>
              <a href="#about">{moment().format('llll')}</a>
            </li>
            <li>
              <a href="https://twitter.com/TCODEMONGER">Twitter</a>
            </li>
            <li>
              <a href="https://github.com/JOHNFLEURIMOND">Github</a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/john-fleurimond">Linkedin</a>
            </li>
          </ul>
        </div>
      </footer>
    </Container>
  );
};

const JFFooterWithStyle = styled(JFProjects, {
  shouldForwardProp,
})(baseFooterStyles, space, flexbox, typography);

export default JFFooterWithStyle;
