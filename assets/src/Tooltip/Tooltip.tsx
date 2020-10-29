/** @jsx jsx */
import {
  Popup as SUIPopup,
  PopupProps as SUIPopupProps,
} from 'semantic-ui-react';
import { jsx, css, SerializedStyles } from '@emotion/core';
import { space } from 'styled-system';
import { fleurimondColors } from '../theme';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
type SUIPopupPosition = SUIPopupProps['position'];

export type VCTooltipProps = SUIPopupProps & {
  position?: TooltipPosition | SUIPopupPosition;
};

const baseTooltipStyles = css({
  '&.ui.popup': {
    display: 'none',
    position: 'absolute',
    top: 0,
    right: 0,
    margin: '0em',
    minWidth: 'min-content',
    maxWidth: '5.625rem',
    zIndex: 1900,
    border: '1px solid #D4D4D5',
    borderRadius: '0.25rem',
    minHeight: '1.25rem',
    background: fleurimondColors.white,
    padding: '0.54rem',
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 'normal',
    fontSize: '13px',
    fontStyle: 'normal',
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow:
      '0px 2px 4px 0px rgba(34, 36, 38, 0.12), 0px 2px 10px 0px rgba(34, 36, 38, 0.15)',
  },

  '&.ui.popup:before': {
    position: 'absolute',
    content: '""',
    width: '0.71428571em',
    height: '0.71428571em',
    background: '#FFFFFF',
    transform: 'rotate(45deg)',
    zIndex: 2,
    boxShadow: '1px 1px 0px 0px #bababc',
  },

  /*--------------
   Spacing
  ---------------*/

  /* Extending from Top */
  '&.ui.top.popup': {
    margin: '0em 0em 0.71428571em',
  },

  '&.ui.top.center.popup': {
    transformOrigin: 'center bottom',
  },

  /* Extending from Vertical Center */
  '&.ui.left.center.popup': {
    margin: '0em 0.71428571em 0em 0em',
    transformOrigin: 'right 50%',
  },

  '&.ui.right.center.popup': {
    margin: '0em 0em 0em 0.71428571em',
    transformOrigin: 'left 50%',
  },

  /* Extending from Bottom */
  '&.ui.bottom.popup': {
    margin: '0.71428571em 0em 0em',
  },

  '&.ui.bottom.center.popup': {
    transformOrigin: 'center top',
  },

  '&.ui.popup > .content': {
    paddingBottom: 'initial',
  },

  /*--------------
     Pointer
  ---------------*/

  /* --- Below ---*/

  '&.ui.bottom.center.popup:before': {
    marginLeft: '-0.30714286em',
    top: '-0.30714286em',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    boxShadow: '-1px -1px 0px 0px #bababc',
  },

  '&.ui.bottom.left.popup': {
    marginLeft: '0em',
    transformOrigin: 'left top',
  },

  '&.ui.bottom.left.popup:before': {
    top: '-0.30714286em',
    left: '1em',
    right: 'auto',
    bottom: 'auto',
    marginLeft: '0em',
    boxShadow: '-1px -1px 0px 0px #bababc',
  },

  '&.ui.bottom.right.popup': {
    marginRight: '0em',
    transformOrigin: 'right top',
  },

  '&.ui.bottom.right.popup:before': {
    top: '-0.30714286em',
    right: '1em',
    bottom: 'auto',
    left: 'auto',
    marginKeft: '0em',
    boxShadow: '-1px -1px 0px 0px #bababc',
  },

  /* --- Above ---*/

  '&.ui.top.center.popup:before': {
    top: 'auto',
    right: 'auto',
    bottom: '-0.30714286em',
    left: '50%',
    marginLeft: '-0.30714286em',
  },

  '&.ui.top.left.popup': {
    marginLeft: '0em',
    transformOrigin: 'left bottom',
  },

  '&.ui.top.left.popup:before': {
    bottom: '-0.30714286em',
    left: '1em',
    top: 'auto',
    right: 'auto',
    marginLeft: '0em',
  },
  '&.ui.top.right.popup': {
    marginRight: '0em',
    transformOrigin: 'right bottom',
  },

  '&.ui.top.right.popup:before': {
    bottom: '-0.30714286em',
    right: '1em',
    top: 'auto',
    left: 'auto',
    marginLeft: '0em',
  },

  /* --- Left Center ---*/

  '&.ui.left.center.popup:before': {
    top: '50%',
    right: '-0.30714286em',
    bottom: 'auto',
    left: 'auto',
    marginTop: '-0.30714286em',
    boxShadow: '1px -1px 0px 0px #bababc',
  },

  /* --- Right Center  ---*/

  '&.ui.right.center.popup:before': {
    top: '50%',
    left: '-0.30714286em',
    bottom: 'auto',
    right: 'auto',
    marginTop: '-0.30714286em',
    boxShadow: '-1px 1px 0px 0px #bababc',
  },

  /* Arrow Color By Location */
  '&.ui.bottom.popup:before': {
    background: '#FFFFFF',
  },

  '&.ui.right.center.popup:before,&.ui.left.center.popup:before': {
    background: '#FFFFFF',
  },

  '&.ui.top.popup:before': {
    background: '#FFFFFF',
  },

  /* Inverted Arrow Color */
  '&.ui.inverted.bottom.popup:before': {
    background: '#191919',
  },

  '&.ui.inverted.right.center.popup:before,&.ui.inverted.left.center.popup:before': {
    background: '#191919',
  },

  '&.ui.inverted.top.popup:before': {
    background: '#191919',
  },

  '&.ui.loading.popup': {
    display: 'block',
    visibility: 'hidden',
    'z-index': '-1',
  },

  '&.ui.animating.popup,&.ui.visible.popup': {
    display: 'block',
  },

  '&.ui.visible.popup': {
    transform: 'translateZ(0px)',
    backfaceVisibility: 'hidden',
  },

  /*--------------
     Basic
  ---------------*/

  '&.ui.basic.popup:before': {
    display: 'none',
  },

  /*--------------
     Wide
  ---------------*/

  '&.ui.wide.popup': {
    maxWidth: '350px',
  },

  '&.ui[class*="very wide"].popup': {
    maxWidth: '550px',
  },

  /*--------------
     Fluid
  ---------------*/

  '&.ui.flowing.popup': {
    maxWidth: 'none',
  },

  /*--------------
     Colors
  ---------------*/

  /* Inverted colors  */
  '&.ui.inverted.popup': {
    background: '#191919',
    color: fleurimondColors.white,
    border: 'none',
    boxShadow: 'none',
  },

  '&.ui.inverted.popup .header': {
    backgroundColor: 'none',
    color: fleurimondColors.white,
  },

  '&.ui.inverted.popup:before': {
    backgroundColor: fleurimondColors.trueBlack,
    boxShadow: 'none !important',
  },
});

const getTooltipStyles = (props): SerializedStyles => {
  return css([baseTooltipStyles, space(props)]);
};

const getSUIPopupPosition = (
  position: TooltipPosition | SUIPopupPosition
): SUIPopupPosition => {
  if (position === 'top') {
    return 'top center';
  }
  if (position === 'right') {
    return 'right center';
  }
  if (position === 'bottom') {
    return 'bottom center';
  }
  if (position === 'left') {
    return 'left center';
  }
  return position;
};

const VCTooltip = (props: VCTooltipProps): JSX.Element => {
  const { position, ...rest } = props;

  return (
    <SUIPopup
      inverted
      position={getSUIPopupPosition(position)}
      css={getTooltipStyles}
      {...rest}
    />
  );
};

export default VCTooltip;
