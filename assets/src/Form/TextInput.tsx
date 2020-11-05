/* eslint-disable @typescript-eslint/no-explicit-any */
/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';
import { Input as SUIInput } from 'semantic-ui-react';

import { fleurimondColors } from '../theme';

export interface InputProps {
  size: 'small' | 'large' | any;
  name: string;
  value: string;
  onChange: any;
  required?: boolean;
  error?: boolean;
  onBlur: any;
  title: string;
  placeholder: string;
}

const baseInputStyles = {
  '&.ui.input > input': {
    borderRadius: '4px',
    borderStyle: 'solid',
    borderWidth: '1px',
    padding: '2px 4px',
    borderColor: '#ccc',
    height: '24px !important',
    backgroundColor: fleurimondColors.white,
    fontFamily: '"Helvetica", Helvetica, sans-serif',
    fontSize: '13px',
    margin: '.5rem .5rem .5rem 2.5rem',
  },
};

const smallInput = {
  '&.ui.input > input': {
    width: '200px',
  },
};

const largeInput = {
  '&.ui.input > input': {
    width: '460px',
  },
};

const getInputStyles = (size): SerializedStyles => {
  switch (size) {
    case 'small':
      return css([baseInputStyles, smallInput]);
    case 'large':
      return css([baseInputStyles, largeInput]);
    default:
      return css([baseInputStyles, smallInput]);
  }
};

const VCInput = (props: InputProps): JSX.Element => {
  const { size, ...rest } = props;
  return (
    <SUIInput
      {...rest}
      css={getInputStyles(size)}
      width={[
        1, // 100% below the smallest breakpoint (all viewports)
        1 / 2, // 50% from the next breakpoint and up
        1 / 4, // 25% from the next breakpoint and up
      ]}
    />
  );
};

export default VCInput;
