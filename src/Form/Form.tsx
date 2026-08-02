/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from "react";
import Checkbox from "./Checkbox";
import Radio from "./Radio";
import Select from "./Select";
import TextInput from "./TextInput";

const Form = (): JSX.Element => <></>;

Form.Checkbox = Checkbox;
Form.TextInput = TextInput;
Form.Radio = Radio;
Form.Select = Select;

export default Form;
