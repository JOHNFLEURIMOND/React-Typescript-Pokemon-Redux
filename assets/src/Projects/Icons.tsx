import {
  Card,
  Container,
  Card as SUICard,
  CardProps as SUICardProps,
} from 'semantic-ui-react';
import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import shouldForwardProp from '@styled-system/should-forward-prop';
import { space, flexbox, typography } from 'styled-system';

import { Header } from '../Header';
import { fleurimondColors } from '../theme';

const baseProjectCardsStyles = css({
  width: '1127px',
  marginLeft: '10% !important',
  marginRight: '10% !important',
  '.card': {
    margin: '1rem',
    padding: '1rem',
    backgroundColor: fleurimondColors.white,
    borderRadius: '.28571429rem',
    display: 'inline-block',
    boxShadow: '1px 3px 3px #000000',

    img: {
      display: 'block',
      width: '100%',
      height: '150px',
      borderRadius: 'inherit',
    },
    '.content': {
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      color: fleurimondColors.modals.text,
      fontWeight: 'normal',
      display: 'block',
      fontSize: '14px',
      lineHeight: 'normal',
      padding: '20px 17px 0 17px',
      paddingBottom: 0,
      overflowY: 'auto',
      flex: '1 1 auto',
    },
    '.header': {
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
    },
  },
});

const src =
  'https://github.com/JOHNFLEURIMOND/MysqlExpressReactNode/blob/master/public/App.png?raw=true';
const src2 =
  'https://github.com/JOHNFLEURIMOND/screenshots/blob/main/Screen%20Shot%202020-10-08%20at%201.58.19%20AM.png?raw=true';
const src3 =
  'https://github.com/JOHNFLEURIMOND/screenshots/blob/main/Screen%20Shot%202020-10-06%20at%205.55.05%20PM.png?raw=true';
const src5 =
  'https://github.com/JOHNFLEURIMOND/redux-api/raw/master/Redux.png?raw=true';
const src4 =
  'https://github.com/JOHNFLEURIMOND/PassportReactExpressNode/blob/master/public/PASSPORT.png?raw=true';
const src6 =
  'https://github.com/JOHNFLEURIMOND/screenshots/blob/main/Screen%20Shot%202020-10-05%20at%206.10.30%20PM.png?raw=true';

const JFProjectCards = (props: SUICardProps): JSX.Element => {
  return (
    <Container {...props}>
      <Header className="ProjectHeader" as="h1" pt={100} pb={100}>
        Projects
      </Header>
      <Card.Group itemsPerRow={4}>
        <SUICard
          image={src}
          href="https://mern-formik.herokuapp.com/"
          header="MERN STACK"
        />
        <SUICard
          image={src2}
          href="https://github.com/JOHNFLEURIMOND/BoardsCommissionsForm"
          header="Application Page"
        />
        <SUICard
          image={src3}
          href="https://simplisafe.com/privacy-protected"
          header="SimpliSafe Page"
        />
        <SUICard
          image={src4}
          href="https://github.com/JOHNFLEURIMOND/PassportReactExpressNode/tree/master/read"
          header="OAuth2 login"
        />
        <SUICard
          image={src5}
          href="https://github.com/JOHNFLEURIMOND/redux-api"
          header="Redux-API"
        />
        <SUICard
          image={src6}
          href="https://tastysinsbyari.com/"
          header="Client's Page"
        />
      </Card.Group>
    </Container>
  );
};

const JFProjectCardsWithStyle = styled(JFProjectCards, {
  shouldForwardProp,
})(baseProjectCardsStyles, space, flexbox, typography);

export default JFProjectCardsWithStyle;
