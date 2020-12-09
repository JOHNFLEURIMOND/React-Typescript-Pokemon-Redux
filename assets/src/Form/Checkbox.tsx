import React from "react";
import { Checkbox as SUICheckbox } from "semantic-ui-react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

const baseCheckboxStyles = css({
  display: "block",
  textColor: "#333",
  fontFamily: '"Helvetica", Helvetica, sans-serif',
  fontWeight: 400,
  fontSize: "13px",

  input: {
    margin: "5px",
  },
});

const VCRadioButton = (props): JSX.Element => {
  return <SUICheckbox {...props} />;
};

const VCRadioButtonWithStyles = styled(VCRadioButton)(baseCheckboxStyles);

export default VCRadioButtonWithStyles;
