import React from 'react';
import { Header as SUIModalHeader } from 'semantic-ui-react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import shouldForwardProp from '@styled-system/should-forward-prop';
import { fleurimondColors } from '../theme';

const CardHeaderStyles = css({
  fontFamily: 'Montserrat, Helvetica, Arial, sans-serif',
  color: fleurimondColors.trueBlack,
  lineHeight: 'normal',
  fontWeight: 'bold',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: fleurimondColors.modals.innerBorders,
  fontSize: '16px',
  padding: '0.94rem',
  marginBottom: 0,
  flex: '0 0 auto',
});

const JFCardHeader = (props): JSX.Element => {
  return <SUIModalHeader {...props} />;
};

const VCModalHeaderWithStyles = styled(JFCardHeader, { shouldForwardProp })(
  CardHeaderStyles
);

export default VCModalHeaderWithStyles;
