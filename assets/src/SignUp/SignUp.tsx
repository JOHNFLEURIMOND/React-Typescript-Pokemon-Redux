import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { Animated } from "react-animated-css";
import shouldForwardProp from "@styled-system/should-forward-prop";
import { space, flexbox, typography } from "styled-system";
import { Container } from "semantic-ui-react";
import { Header } from "../Header";
import { fleurimondColors } from "../theme";
import TextInput from "../Form/TextInput";

const baseBannerStyles = css({
  boxSizing: "border-box",
  minWidth: 0,
  fontSize: "1rem",
  color: fleurimondColors.black,
  lineHeight: "normal",
  fontWeight: 600,
  margin: 0,
  padding: "0",
  height: "700px",
  width: "100%",
  backgroundColor: fleurimondColors.white,

  ".leftHalf": {
    width: "50%",
    display: "inline-block",
  },
  ".rightHalf": {
    width: "50%",
    display: "inline-block",
  },
  "*": {
    fontFamily: "Montserrat, sans-serif",
  },
});

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
    padding: "5rem",
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
    width: "200px",
  },
  button: {
    display: "block",
    marginLeft: "5.5rem",
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
    lineHeight: "40px",
  },
});

const JFSignUp = (props): JSX.Element => {
  return (
    <Container {...props}>
      <Animated
        animationInDelay={0}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        isVisible
      >
        <Header className="BannerHeader" as="h1" pt={200} pl={100}>
          New Members Sign Up
        </Header>
        <div className="">
          <Container {...props}>
            <Header className="ContactHeader" as="h1">
              Contact
            </Header>
            <div className="jumbotron">
              <Formik
                initialValues={{
                  email: "",
                  confirmEmail: "",
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string()
                    .email()
                    .required("Your Email Is Required!"),
                  confirmEmail: Yup.string()
                    .email()
                    .required("Your Confirm Email Is Required!")
                    .oneOf(
                      [Yup.ref("email", undefined)],
                      "Make Sure Emails Match!"
                    ),
                  password: Yup.string()
                    .required("Password Is Required!")
                    .min(2, "Your Password Needs To Be Valid"),
                  confirmPassword: Yup.string()
                    .matches(
                      new RegExp(/^\d{5}$/),
                      "Your Phone Number Is Not Valid"
                    )
                    .required("Your State Name Is Required!")
                    .oneOf(
                      [Yup.ref("password", undefined)],
                      "Make Sure Password Match!"
                    ),
                })}
                onSubmit={(values, actions) => {
                  setTimeout(() => {
                    console.log("hi", { values, actions });
                    alert(JSON.stringify(values, null, 2));
                    actions.setSubmitting(false);
                  }, 4000);
                }}
                render={({ isSubmitting, dirty }) => (
                  <Form>
                    <TextInput size="small" onChange={() => ""} />
                    <TextInput size="small" onChange={() => ""} />
                    <hr className="hr hr--sq" />
                    <TextInput size="small" onChange={() => ""} />
                    <TextInput size="small" onChange={() => ""} />

                    <button
                      type="submit"
                      disabled={!dirty || isSubmitting}
                      aria-label="Primary Small Button"
                    >
                      Send A Message
                    </button>
                  </Form>
                )}
              />
            </div>
          </Container>
        </div>
      </Animated>
    </Container>
  );
};

const JFSignUpWithStyle = styled(JFSignUp, {
  shouldForwardProp,
})(baseBannerStyles, formStyles, space, flexbox, typography);

export default JFSignUpWithStyle;
