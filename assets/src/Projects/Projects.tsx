import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import shouldForwardProp from '@styled-system/should-forward-prop';
import { space, flexbox, typography } from 'styled-system';
import { Container } from 'semantic-ui-react';
import Icons from './Icons';

import { fleurimondColors } from '../theme';

const baseProjectsStyles = css({
  boxSizing: 'border-box',
  minWidth: 0,
  color: fleurimondColors.black,
  lineHeight: 'normal',
  fontWeight: 600,
  height: '100%',
  width: '100%',
  backgroundColor: fleurimondColors.white,
  display: 'flex',
  justifyContent: 'center',
  overflowX: 'hidden',
  paddingBottom: '7rem',

  '.ProjectHeader': {
    width: '100%%',
    fontSize: '2rem',
    display: 'block',
    justifyContent: 'center',
    textAlign: 'center',
    margin: '0 3rem 0 0',
  },
  '.ui.four.cards>.card': {
    width: '15rem',
    marginLeft: '.75em',
    marginRight: '.75em',
  },
  '.ui.four.cards': {
    paddingLeft: '4em',
    width: '100%',
  },
});

const JFProjects = (props): JSX.Element => {
  return (
    <Container {...props} pb={200}>
      <Icons />
    </Container>
  );
};

const JFProjectsWithStyle = styled(JFProjects, {
  shouldForwardProp,
})(baseProjectsStyles, space, flexbox, typography);

export default JFProjectsWithStyle;
