import React from 'react';
import { CardDescription as SUICardDescription } from 'semantic-ui-react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import shouldForwardProp from '@styled-system/should-forward-prop';
import { fleurimondColors } from '../theme';

const CardActionsStyles = css({
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: fleurimondColors.modals.innerBorders,
  display: 'flex',
  textAlign: 'center',
  justifyContent: 'center',
  padding: '1.2rem',
  boxSizing: 'border-box',
  flex: '0 0 auto',
});

const JFCardActions = (props): React.ReactElement => {
  return <SUICardDescription {...props} />;
};
const JFCardActionsWithStyles = styled(JFCardActions, { shouldForwardProp })(
  CardActionsStyles
);

export default JFCardActionsWithStyles;
