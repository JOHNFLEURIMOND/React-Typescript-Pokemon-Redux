import { css } from "@emotion/core";
import { Radio as SUIRadio, RadioProps } from "semantic-ui-react";

const baseRadioButtonStyles = css({
  display: "block",
  textColor: "#333",
  fontFamily: '"Helvetica", Helvetica, sans-serif',
  fontWeight: 400,
  fontSize: "13px",

  input: {
    margin: "5px",
  },
});

const VCRadioButton = (props: RadioProps): JSX.Element => {
  return <SUIRadio {...props} css={baseRadioButtonStyles} />;
};

export default VCRadioButton;
