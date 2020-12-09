/* eslint-disable @typescript-eslint/no-explicit-any */
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { TextArea as SUITextArea } from "semantic-ui-react";

export interface TextAreaProps {
  size: "small" | "large";
  name: string;
  value: string;
  onChange: any;
  required?: boolean;
  error?: string;
  onBlur: any;
  title: string;
  placeholder: string;
}

const JFTextArea = (props: TextAreaProps): JSX.Element => {
  const { size, ...rest } = props;
  return <SUITextArea {...rest} css={size} />;
};

export default JFTextArea;
