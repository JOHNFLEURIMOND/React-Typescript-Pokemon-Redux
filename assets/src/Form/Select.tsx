/** @jsx jsx */
import { jsx, css } from "@emotion/core";

const baseSelectStyles = css({
  display: "inline-block",
  fontFamily: "Helvetica, sans-serif",
  fontSize: "13px",
  borderColor: "#ccc",
  textColor: "#333",
  lineHeight: "normal",
  fontWeight: 300,
  width: "15.2rem",
  height: "24px",
  marginTop: "1em",
  border: "1px solid #ccc",
});

const JFSelect = (props: any): JSX.Element => {
  return <select {...props} css={baseSelectStyles} />;
};

export default JFSelect;
