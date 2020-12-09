import React from "react";
import { Form, Header } from "../src";

export default {
  title: "Form",
};

export const Input = (): React.ReactElement => {
  return (
    <>
      <div style={{ marginBottom: "2em" }}>
        <Header as="h1" my={2}>
          Short Input
        </Header>
        <Form.Input fluid size="tiny" />
      </div>

      <div style={{ marginBottom: "2em" }}>
        <Header as="h1" my={2}>
          Long Input
        </Header>
        <Form.Input fluid size="large" />
      </div>

      <div style={{ marginBottom: "2em" }}>
        <Header as="h1" my={2}>
          Disabled Input
        </Header>
        <Form.Input fluid size="large" disabled placeholder="I am disabled" />
      </div>
    </>
  );
};

export const Radio = (): React.ReactElement => (
  <>
    <div style={{ marginBottom: "2em" }}>
      <Header as="h1" my={2}>
        Radio
      </Header>
      <Form.Radio
        label="Security Leads Only"
        name="radioGroup"
        value="Security Leads Only"
      />
      <Form.Radio
        label="Teams & Security Leads"
        name="radioGroup"
        value="Teams & Security Leads"
      />
    </div>
  </>
);

export const Checkbox = (): React.ReactElement => (
  <>
    <div style={{ marginBottom: "2em" }}>
      <Header as="h1" my={2}>
        Checkbox
      </Header>
      <Form.Checkbox label="Download available" />
      <Form.Checkbox label="Make my scan visible" />
    </div>
  </>
);

export const Select = (): React.ReactElement => (
  <>
    <div style={{ marginBottom: "2em" }}>
      <Header as="h1" my={2}>
        Select
      </Header>
      <Form.Select>
        <option value="Option 1">Option 1</option>
        <option value="Option 2">Option 2</option>
        <option value="Option 3">Option 3</option>
        <option value="Option 4">Option 4</option>
      </Form.Select>
    </div>
  </>
);
