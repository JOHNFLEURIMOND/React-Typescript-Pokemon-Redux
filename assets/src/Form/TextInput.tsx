/* eslint-disable @typescript-eslint/no-explicit-any */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
  Field,
} from 'formik';

export interface InputProps {
  name: string;
  placeholder: string;
  title: string;
  error?: string;
  required?: boolean;
}

const VCInput = (props: InputProps ): JSX.Element => {
  return (
    <div>
    <label >
      {props.title}
      {props.required && (
        <span aria-hidden="true">
          {' '}
          Required
        </span>
      )}
    </label>
    <Field
      name={props.name}
      placeholder={props.placeholder}
      required={props.required}
    />
    {props.error && (
      <div>{props.error}</div>
    )}
  </div>
  );
};

export default VCInput;