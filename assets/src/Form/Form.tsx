/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from "react";
import { Formik } from "formik";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import shouldForwardProp from "@styled-system/should-forward-prop";
import { Container } from "semantic-ui-react";
import * as Yup from "yup";
import { Header } from "../Header";
import { Button } from "../Button";
import TextInput from "./TextInput";

import { fleurimondColors } from "../theme";

const formStyles = css({
  boxSizing: "border-box",
  minWidth: 0,
  fontSize: "1rem",
  color: fleurimondColors.steelTeal,
  lineHeight: "normal",
  fontWeight: 600,
  display: "block",
  justifyContent: "center",
  alignContent: "center",
  height: "850px",
  width: "100vw",
  backgroundColor: fleurimondColors.white,
  overflowX: "hidden",

  ".ContactHeader": {
    fontSize: "2rem",
    justifyContent: "center",
    textAlign: "center",
    alignContent: "center",
    padding: "5rem"
  },
  ".Comment": {
    borderRadius: "4px",
    borderStyle: "solid",
    borderWidth: "1px",
    padding: "2px 4px",
    borderColor: "#ccc",
    height: "20% !important",
    backgroundColor: fleurimondColors.white,
    fontFamily: '"Helvetica", Helvetica, sans-serif',
    fontSize: "13px",
    margin: "2.5rem",
    width: "200px"
  },
  button: {
    display: "block",
    marginLeft: "5.5rem"
  },
  form: {
    width: "295px",
    height: "500px",
    top: "16px",
    left: "73px",
    padding: "30px",
    marginLeft: "31%",
    position: "relative",
    background: ["grey", "#f6f6f5"],
    display: "inline-block",
    boxShadow: "-3px 3px 4px 0 rgba(0, 0, 0, 0.13)",
    borderRadius: "3px",
    letterSpacing: "2px",
    lineHeight: "40px"
  }
});

const JFForm = (props): React.ReactElement => {
  return (
    <Container {...props}>
      <Header className="ContactHeader" as="h1">
        Sign Up
      </Header>
      <div className="jumbotron">
        <Formik
          initialValues={{
            email: "",
            confirmEmail: "",
            password: "",
            confirmPassword: ""
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email().required("Your Email Is Required!"),
            confirmEmail: Yup.string()
              .email()
              .required("Your Confirm Email Is Required!")
              .oneOf([Yup.ref("email", undefined)], "Make Sure Emails Match!"),
            password: Yup.string()
              .required("Password Is Required!")
              .min(2, "Your Password Needs To Be Valid"),
            confirmPassword: Yup.string()
              .matches(new RegExp(/^\d{5}$/), "Your Phone Number Is Not Valid")
              .required("Your State Name Is Required!")
              .oneOf(
                [Yup.ref("password", undefined)],
                "Make Sure Password Match!"
              )
          })}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              console.log({ values, actions });
              alert(JSON.stringify(values, null, 2));
              actions.setSubmitting(false);
            }, 400);
          }}
          render={({
            isSubmitting,
            handleSubmit,
            dirty
          }) => (
            <form onSubmit={handleSubmit}>
              <TextInput
                title="Email"
                name="email"
                placeholder="Email"
                required
              />
              <TextInput
                title="Confirm Email"
                name="confirmEmail"
                placeholder="Confirm Email"
                required
              />
              <hr className="hr hr--sq" />
              <TextInput
                title="password"
                name="password"
                placeholder="Please, Create a secure password"
              />
              <TextInput
                title="Confirm Password"
                name="confirmPassword"
                placeholder="Confirm Password!"
              />
              <Button type="submit" disabled={!dirty || isSubmitting}>
                Send A Message
              </Button>
            </form>
          )}
        />
      </div>
    </Container>
  );
};
const JFFormWithStyles = styled(JFForm, { shouldForwardProp })(formStyles);

export default JFFormWithStyles;
