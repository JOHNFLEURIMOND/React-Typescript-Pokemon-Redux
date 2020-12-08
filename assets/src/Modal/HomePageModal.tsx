import React, { useState } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Animated } from 'react-animated-css';
import shouldForwardProp from '@styled-system/should-forward-prop';
import { space, flexbox, typography } from 'styled-system';
import { Container } from 'semantic-ui-react';
import { Header } from '../Header';
import { Modal, ConfirmModal } from '../Modal';
import { Button } from '../Button';
import { fleurimondColors } from '../theme';

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

const JFHomePageModal = (props): JSX.Element => {
  const [open, setOpen] = useState(false);

  return (
    <Container {...props}>
      <Animated
        animationInDelay={0}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        isVisible
      >
        <Header className="BannerHeader" as="h1" pt={200} pl={100}>
          Membership
        </Header>
        <ConfirmModal
          open={open}
          onClose={(): void => setOpen(false)}
          trigger={
            <Button
              variant="secondary"
              aria-label="Secondary Button"
              onClick={(): void => setOpen(true)}
            >
             Enter
            </Button>
          }
        >
          <Modal.Header>Welcome</Modal.Header>
          <Modal.Content className="modal-demo-content">
            <p> Login or Sign Up.</p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              variant="secondary"
              aria-label="Secondary Button"
              onClick={(): void => {
                setOpen(false);
              }}
              mr={2}
            >
              Login
            </Button>
            <Button
              variant="primary"
              aria-label="Primary Button"
              onClick={(): void => alert('Hi')}
            >
              Sign Up
            </Button>
          </Modal.Actions>
        </ConfirmModal>
      </Animated>
    </Container>
  );
};

const JFHomePageModalWithStyle = styled(JFHomePageModal, {
  shouldForwardProp
})(baseBannerStyles, space, flexbox, typography);

export default JFHomePageModalWithStyle;
