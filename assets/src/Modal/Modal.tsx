/** @jsx jsx */
import { jsx, css, SerializedStyles } from '@emotion/core';
import { Modal as SUIModal } from 'semantic-ui-react';
import ModalContent from './ModalContent';
import ModalActions from './ModalActions';
import ModalHeader from './ModalHeader';

import { fleurimondColors } from '../theme';

type ModalVariation = 'tiny' | 'small' | 'large';
export interface VCModalProps {
  size?: ModalVariation;
}

const modalStyles = css({
  '&.ui.modal': {
    backgroundColor: fleurimondColors.white,
    borderRadius: '0.375rem',
    bottom: 'initial',
    boxShadow:
      '0 0.19rem 0.56rem rgba(0, 0, 0, 0.5), 0 0.19rem 0.56rem rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    left: 'initial',
    minHeight: '200px',
    maxHeight: '80vh',
    position: 'absolute',
    right: 'initial',
    top: 'initial',
    transformOrigin: '50% 25%',
    userSelect: 'text',
    willChange: 'top, left, margin, transform, opacity',
    'z-index': '1001 !important',
  },

  '&.ui.modal.tiny': {
    width: '350px',
  },

  '&.ui.modal.small': {
    width: '500px',
  },

  '&.ui.modal.large': {
    width: '750px',
  },

  '.close.icon': {
    fontStyle: 'normal',
    fontWeight: 'bold',
  },

  '.close.icon::after': {
    content: '"×"',
    fontSize: '1.31rem',
    color: fleurimondColors.trueBlack,
    opacity: 0.2,
    display: 'block',
    position: 'absolute',
    right: 0,
    padding: '0.8rem 1rem',
    cursor: 'pointer',
  },

  '.close.icon:hover::after': {
    opacity: 1,
  },
});

const getModalStyles = (): SerializedStyles => {
  return css([modalStyles]);
};

const VCModal = (props): JSX.Element => {
  /* Veracode Modals always have the 'inverted' dimmer aka the 'Milkout' */
  return <SUIModal {...props} dimmer="inverted" css={getModalStyles()} />;
};

VCModal.Header = ModalHeader;
VCModal.Content = ModalContent;
VCModal.Actions = ModalActions;

export default VCModal;
