/** @jsx jsx */
import React from 'react';
import { jsx, css, SerializedStyles } from '@emotion/core';
import { Card as SUICard, CardProps as SUICardProps } from 'semantic-ui-react';
import CardContent from './CardContent';
import CardDescription from './CardDescription';
import CardHeader from './CardHeader';

import { fleurimondColors } from '../theme';

export interface JFCardProps extends SUICardProps {
  as?: string;
  content?: React.ReactNode;
}

const baseCardStyles = css({
  '&.card': {
    width: '290px',
    marginTop: '3rem',
    padding: '3rem',
    backgroundColor: fleurimondColors.white,
    borderRadius: '.28571429rem',
    display: 'inline-block',
    boxShadow: '1px 3px 3px #000000',
  },
});

const getCardsStyles = (): SerializedStyles => {
  return css([baseCardStyles]);
};

const JFCard = (props: JFCardProps): JSX.Element => {
  return <SUICard {...props} css={getCardsStyles()} />;
};

JFCard.Content = CardContent;
JFCard.Description = CardDescription;
JFCard.Header = CardHeader;

export default JFCard;
