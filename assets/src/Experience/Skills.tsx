import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { space } from 'styled-system';
import styled from '@emotion/styled';
import shouldForwardProp from '@styled-system/should-forward-prop';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import {
  faSass,
  faReact,
  faNode,
  faCss3Alt,
  faJsSquare,
  faHtml5,
  faPhp,
  faGitSquare,
} from '@fortawesome/free-brands-svg-icons';
import 'normalize.css';
import '../App.css';
import { Icon } from '@iconify/react';
import typescriptIcon from '@iconify/icons-simple-icons/typescript';

const JFSkills = (): JSX.Element => {
  return (
    <div className="Skills-container">
      <FontAwesomeIcon
        className="fontIcon"
        icon={faReact}
        size="9x"
        style={{ padding: '3rem' }}
      />
      <FontAwesomeIcon
        className="fontIcon"
        icon={faCss3Alt}
        size="9x"
        style={{ padding: '3rem' }}
      />
      <FontAwesomeIcon
        className="fontIcon"
        icon={faSass}
        size="9x"
        style={{ padding: '3rem' }}
      />
      <FontAwesomeIcon
        className="fontIcon"
        icon={faHtml5}
        size="9x"
        style={{ padding: '3rem' }}
      />
      <FontAwesomeIcon
        className="fontIcon"
        icon={faNode}
        size="9x"
        style={{ padding: '3rem' }}
      />
      <FontAwesomeIcon
        className="fontIcon"
        icon={faJsSquare}
        size="9x"
        style={{ padding: '3rem' }}
      />
      <FontAwesomeIcon
        className="fontIcon"
        icon={faDatabase}
        size="9x"
        style={{ padding: '3rem' }}
      />
      <FontAwesomeIcon
        className="fontIcon"
        icon={faGitSquare}
        size="9x"
        style={{ padding: '3rem' }}
      />
      <FontAwesomeIcon
        className="fontIcon"
        icon={faPhp}
        size="9x"
        style={{ padding: '3rem' }}
      />
      <Icon
        icon={typescriptIcon}
        style={{ padding: '3rem', fontSize: '7.4rem' }}
      />
    </div>
  );
};

const JFSkillssWithStyle = styled(JFSkills, {
  shouldForwardProp,
})(space);

export default JFSkillssWithStyle;
