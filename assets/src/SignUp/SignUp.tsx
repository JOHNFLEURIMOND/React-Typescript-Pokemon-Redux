import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Animated } from 'react-animated-css';
import shouldForwardProp from '@styled-system/should-forward-prop';
import { space, flexbox, typography } from 'styled-system';
import { Container } from 'semantic-ui-react';
import { Header } from '../Header';
import { fleurimondColors } from '../theme';
import TextInput from '../Form/TextInput';
import CommentInput from '../Form/CommentInput';

import { Button } from '../Button';

const baseBannerStyles = css({
  boxSizing: 'border-box',
  minWidth: 0,
  fontSize: '1rem',
  color: fleurimondColors.black,
  lineHeight: 'normal',
  fontWeight: 600,
  margin: 0,
  padding: '0',
  height: '700px',
  width: '100%',
  backgroundColor: fleurimondColors.white,

  '.leftHalf': {
    width: '50%',
    display: 'inline-block'
  },
  '.rightHalf': {
    width: '50%',
    display: 'inline-block'
  },
  '*': {
    fontFamily: 'Montserrat, sans-serif'
  }
});

const formStyles = css({
  boxSizing: 'border-box',
  minWidth: 0,
  fontSize: '1rem',
  color: fleurimondColors.steelTeal,
  lineHeight: 'normal',
  fontWeight: 600,
  display: 'block',
  justifyContent: 'center',
  alignContent: 'center',
  height: '850px',
  width: '100vw',
  backgroundColor: fleurimondColors.white,
  overflowX: 'hidden',

  '.ContactHeader': {
    fontSize: '2rem',
    justifyContent: 'center',
    textAlign: 'center',
    alignContent: 'center',
    padding: '5rem',
  },
  '.Comment': {
    borderRadius: '4px',
    borderStyle: 'solid',
    borderWidth: '1px',
    padding: '2px 4px',
    borderColor: '#ccc',
    height: '20% !important',
    backgroundColor: fleurimondColors.white,
    fontFamily: '"Helvetica", Helvetica, sans-serif',
    fontSize: '13px',
    margin: '2.5rem',
    width: '200px',
  },
  button: {
    display: 'block',
    marginLeft: '5.5rem',
  },
  form: {
    width: '295px',
    height: '500px',
    top: '16px',
    left: '73px',
    padding: '30px',
    marginLeft: '31%',
    position: 'relative',
    background: ['grey', '#f6f6f5'],
    display: 'inline-block',
    boxShadow: '-3px 3px 4px 0 rgba(0, 0, 0, 0.13)',
    borderRadius: '3px',
    letterSpacing: '2px',
    lineHeight: '40px',
  },
});

const JFSignUp = (props): JSX.Element => {
  return (
    <Container {...props}>
      <Animated
        animationInDelay={0}
        animationIn='slideInUp'
        animationOut='slideOutDown'
        isVisible>
        <Header className='BannerHeader' as='h1' pt={200} pl={100}>
          New Members Sign Up
        </Header>
        <div className=''>
          <Container {...props}>
            <Header className="ContactHeader" as="h1">
              Contact
      </Header>
            <div className="jumbotron">
              <Formik
                initialValues={{
                  firstName: '',
                  middleName: '',
                  lastName: '',
                  phone: '',
                  email: '',
                  confirmEmail: '',
                  comments: '',
                }}
                validationSchema={Yup.object().shape({
                  zip: Yup.string()
                    .required('Zip Code Is Required')
                    .matches(new RegExp(/^\d{5}$/), 'Zip Codes Contains 5 Digits'),
                  firstName: Yup.string()
                    .required('Your First Name Is Required!')
                    .min(2, 'Your First Name Needs To Be Valid'),
                  lastName: Yup.string()
                    .required('Your Last Name Is Required!')
                    .min(2, 'Your Last Name Needs To Be Valid'),
                  phone: Yup.string()
                    .matches(new RegExp(/^\d{5}$/), 'Your Phone Number Is Not Valid')
                    .required('Your State Name Is Required!'),
                  comments: Yup.string().min(1),
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
                  values,
                  handleChange,
                  handleBlur,
                  dirty,
                }) => (
                    <form onSubmit={handleSubmit}>
                      <TextInput
                        size="small"
                        title="First Name"
                        name="firstName"
                        placeholder="First Name"
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />

                      <TextInput
                        size="small"
                        title="Initial"
                        name="middleName"
                        placeholder="Middle Initial"
                        value={values.middleName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                      <TextInput
                        size="small"
                        title="Last Name"
                        name="lastName"
                        placeholder="Last Name"
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />

                      <TextInput
                        size="small"
                        title="Phone"
                        name="phone"
                        placeholder="Phone Number"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <TextInput
                        size="small"
                        title="Email"
                        name="email"
                        placeholder="Email"
                        value={values.email}
                        onChange={handleChange}
                        required
                        onBlur={handleBlur}
                      />
                      <TextInput
                        size="small"
                        title="Confirm Email"
                        name="confirmEmail"
                        placeholder="Confirm Email"
                        value={values.confirmEmail}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />

                      <CommentInput
                        name="comments"
                        size="large"
                        title="Comments"
                        placeholder="Other Comments You Would Like Us to Know."
                        value={values.comments}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Button
                        type="submit"
                        disabled={!dirty || isSubmitting}
                      >
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

const JFSignUpWithStyle = styled(JFSignUp, {
  shouldForwardProp
})(baseBannerStyles, formStyles, space, flexbox, typography);

export default JFSignUpWithStyle;
