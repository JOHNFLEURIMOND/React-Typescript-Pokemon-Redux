import React from 'react';
import { ModalActions as SUIModalActions } from 'semantic-ui-react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import shouldForwardProp from '@styled-system/should-forward-prop';
import { fleurimondColors } from '../theme';

const modalActionsStyles = css({
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

const VCModalActions = (props): React.ReactElement => {
  return <SUIModalActions {...props} />;
};
const VCModalActionsWithStyles = styled(VCModalActions, { shouldForwardProp })(
  modalActionsStyles
);

export default VCModalActionsWithStyles;
