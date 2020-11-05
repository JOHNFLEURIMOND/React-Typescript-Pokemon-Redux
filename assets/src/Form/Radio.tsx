/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Radio as SUIRadio } from 'semantic-ui-react';

const baseRadioButtonStyles = css({
  display: 'block',
  textColor: '#333',
  fontFamily: '"Helvetica", Helvetica, sans-serif',
  fontWeight: 400,
  fontSize: '13px',

  input: {
    margin: '5px',
  },
});

const VCRadioButton = (props): JSX.Element => {
  return <SUIRadio {...props} css={baseRadioButtonStyles} />;
};

export default VCRadioButton;
