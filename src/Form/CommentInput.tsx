import type { ChangeEventHandler, FocusEventHandler } from "react";
import { TextArea as SUITextArea } from "semantic-ui-react";

export interface TextAreaProps {
  size: "small" | "large";
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  required?: boolean;
  error?: string;
  onBlur: FocusEventHandler<HTMLTextAreaElement>;
  title: string;
  placeholder: string;
}

const JFTextArea = (props: TextAreaProps): JSX.Element => {
  const { size, ...rest } = props;
  return <SUITextArea {...rest} css={size} />;
};

export default JFTextArea;
