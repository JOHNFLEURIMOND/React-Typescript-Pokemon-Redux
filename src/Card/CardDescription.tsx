import type { ReactElement } from "react";
import {
  CardDescription as SUICardDescription,
  CardDescriptionProps as SUICardDescriptionProps,
} from "semantic-ui-react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import shouldForwardProp from "@styled-system/should-forward-prop";
import { fleurimondColors } from "../theme";

const CardActionsStyles = css({
  borderTopWidth: "1px",
  borderTopStyle: "solid",
  borderTopColor: fleurimondColors.modals.innerBorders,
  display: "flex",
  textAlign: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  flex: "0 0 auto",
});

const JFCardActions = (props: SUICardDescriptionProps): ReactElement => {
  return <SUICardDescription {...props} />;
};
const JFCardActionsWithStyles = styled(JFCardActions, { shouldForwardProp })(
  CardActionsStyles
);

export default JFCardActionsWithStyles;
