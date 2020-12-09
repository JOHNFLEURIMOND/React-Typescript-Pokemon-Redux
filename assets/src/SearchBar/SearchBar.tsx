import React,{useState, useCallback, useMemo} from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { Animated } from "react-animated-css";
import shouldForwardProp from "@styled-system/should-forward-prop";
import { space, flexbox, typography } from "styled-system";
import { Container } from "semantic-ui-react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Header } from "../Header";
import { Button } from "../Button";
import TextInput from "../Form/TextInput";

import { fleurimondColors } from "../theme";

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

  img: {
    width: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "right",
    paddingLeft: "250px",
  },

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

const useUserInput = (defaultValue: string = "") => {
  const [value, setValue] = useState(defaultValue);
  const onChange = useCallback((e) => setValue(e.target.value), []);

  return {value, onChange,};
};

const searchText = useUserInput("");

const JFBanner = (props): JSX.Element => {
  return (
    <Container {...props}>
      <Animated
        animationInDelay={0}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        isVisible
      >
        <div className="leftHalf">
          <Header className="BannerHeader" as="h1" pt={200} pl={100}>
            Marvel
          </Header>
          <Header className="BannerHeader2" as="h2" pt={50} pl={100}>
            Search For Your Favorite Hero
          </Header>
        </div>

        <div className="rightHalf">
          <Container {...props}>
            <div className="jumbotron">
              <Formik
                initialValues={{
                  Hero: "",
                }}
                validationSchema={Yup.object().shape({
                  Hero: Yup.string()
                    .required("Super Hero Name Is Required!")
                    .min(2, "Super Hero Name  Needs To Be Valid"),
                })}
                onSubmit={(values, actions) => {
                  setTimeout(() => {
                    console.log({ values, actions });
                    alert(JSON.stringify(values, null, 2));
                    actions.setSubmitting(false);
                  }, 400);
                }}
                render={({ isSubmitting, handleSubmit, dirty }) => (
                  <form onSubmit={handleSubmit}>
                    <TextInput
                      title=""
                      name="Hero"
                      placeholder="Search For Your Favorite Super Hero "
                      size="large"
                      {...searchText}
                    />

                    <Button type="submit" disabled={!dirty || isSubmitting}>
                      Send A Message
              </Button>
                  </form>
                )}
              />
            </div>
          </Container>
        </div>
      </Animated>
    </Container>
  );
};

const JFBannerWithStyle = styled(JFBanner, {
  shouldForwardProp,
})(baseBannerStyles, space, flexbox, typography);

export default JFBannerWithStyle;
