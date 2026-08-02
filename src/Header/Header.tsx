import type { ReactNode } from "react";
import {
  Header as SUIHeader,
  HeaderProps as SUIHeaderProps,
} from "semantic-ui-react";
import styled from "@emotion/styled";
import shouldForwardProp from "@styled-system/should-forward-prop";
import { space } from "styled-system";
import { fleurimondColors } from "../theme";

export interface VCHeaderProps extends SUIHeaderProps {
  as?: string;
  content?: ReactNode;
}

const baseHeaderStyles = {
  fontFamily: "Montserrat, Helvetica, Arial, sans-serif",
  textColor: fleurimondColors.orneryOrange,
  lineHeight: "normal",
  fontWeight: 600,
  margin: 0,
};

const header1 = {
  fontSize: "25px",
};

const header2 = {
  fontSize: "16px",
};

const header3 = {
  fontSize: "13px",
};

const headerStyle = (props: VCHeaderProps) => {
  switch (props.as) {
    case "h1":
      return header1;
    case "h2":
      return header2;
    case "h3":
      return header3;
    case "h4":
      return header3;
    case "h5":
      return header3;
    case "h6":
      return header3;
    default:
      return header1;
  }
};

const VCHeaders = (props: VCHeaderProps): JSX.Element => {
  return <SUIHeader {...props} />;
};

const VCHeaderWithStyle = styled(VCHeaders, {
  shouldForwardProp,
})(baseHeaderStyles, headerStyle, space);

export default VCHeaderWithStyle;
