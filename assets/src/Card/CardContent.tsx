import React from "react";
import { CardContent as SUICardContent } from "semantic-ui-react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import shouldForwardProp from "@styled-system/should-forward-prop";

import { fleurimondColors } from "../theme";

const JFCardContentStyles = css({
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  color: fleurimondColors.modals.text,
  fontWeight: "normal",
  display: "block",
  fontSize: "14px",
  lineHeight: "normal",
  padding: "20px 17px 0 17px",
  paddingBottom: 0,
  overflowY: "auto",
  flex: "1 1 auto",
});

const JFCardContent = (props): React.ReactElement => {
  return <SUICardContent {...props} />;
};

const VCModalContentWithStyles = styled(JFCardContent, { shouldForwardProp })(
  JFCardContentStyles
);

export default VCModalContentWithStyles;
