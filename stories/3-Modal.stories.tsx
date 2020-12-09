import React, { useState } from "react";
import { action } from "@storybook/addon-actions";
import { Modal, ConfirmModal, ComplexModal, SimpleModal } from "../src/Modal";
import { Button } from "../src/Button";
import { Header } from "../src/Header";
import "./3-Modal.stories.css";

export default {
  title: "Modal",
};

export const Confirm = (): React.ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Header as="h1" my={2}>
        Confirm Modal
      </Header>
      <ConfirmModal
        open={open}
        onClose={(): void => setOpen(false)}
        trigger={
          <Button
            variant="secondary"
            aria-label="Secondary Button"
            onClick={(): void => setOpen(true)}
          >
            Show Modal
          </Button>
        }
      >
        <Modal.Header>Edit Licensing Method</Modal.Header>
        <Modal.Content className="modal-demo-content">
          <p> Are you sure you would delete this scan.</p>
        </Modal.Content>
        <Modal.Actions>
          <Button
            variant="secondary"
            aria-label="Secondary Button"
            onClick={(): void => {
              setOpen(false);
            }}
            mr={2}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            aria-label="Primary Button"
            onClick={action("clicked")}
          >
            Submit
          </Button>
        </Modal.Actions>
      </ConfirmModal>
    </>
  );
};

export const Simple = (): React.ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Header as="h1" my={2}>
        Simple Modal
      </Header>
      <SimpleModal
        open={open}
        onClose={(): void => setOpen(false)}
        trigger={
          <Button
            variant="secondary"
            aria-label="Secondary Button"
            onClick={(): void => setOpen(true)}
          >
            Show Modal
          </Button>
        }
      >
        <Modal.Header>Edit Licensing Method</Modal.Header>
        <Modal.Content className="modal-demo-content">
          <p>
            Edit the licensing method for this scan request. The default option
            for the third party scan requests can be changed in Analysis Center
            at &quot;Admin &gt; Third Party&quot;.
          </p>
          <div className="form-row">
            <div className="form-radio-group-label">Licensing Method:</div>
            <div>
              <label htmlFor="organization">
                <input
                  id="organization"
                  type="radio"
                  name="Scan"
                  value="Organization"
                />{" "}
                My Organization will pay for the scan
              </label>
              <label htmlFor="vendor">
                <input
                  id="vendor"
                  className="vendor-radioButton-section"
                  type="radio"
                  name="Scan"
                  value="Vendor"
                />{" "}
                Vendor will pay for the scan
              </label>
            </div>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button
            variant="secondary"
            aria-label="Secondary Button"
            onClick={(): void => {
              setOpen(false);
            }}
            mr={2}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            aria-label="Primary Button"
            onClick={action("clicked")}
          >
            Submit
          </Button>
        </Modal.Actions>
      </SimpleModal>
    </>
  );
};

export const Complex = (): React.ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Header as="h1" my={2}>
        Complex Modal
      </Header>
      <ComplexModal
        size="large"
        open={open}
        onClose={(): void => setOpen(false)}
        trigger={
          <Button
            variant="secondary"
            aria-label="Secondary Button"
            onClick={(): void => setOpen(true)}
          >
            Show Modal
          </Button>
        }
        closeIcon
      >
        <Modal.Header>Edit Licensing Method</Modal.Header>
        <Modal.Content className="modal-demo-content">
          <p>
            Edit the licensing method for this scan request. The default option
            for the third party scan requests can be changed in Analysis Center
            at &quot;Admin &gt; Third Party&quot;.
          </p>
          <p>
            Completely conceptualize intermandated synergy rather than team
            building human capital. Completely foster alternative partnerships
            after long-term high-impact initiatives. Dynamically envisioneer
            standardized users through prospective bandwidth. Assertively
            incentivize go forward data without integrated leadership skills.
            Quickly underwhelm backend e-tailers through wireless.
          </p>
          <p>
            Quickly syndicate compelling potentialities with multifunctional
            imperatives. Completely customize multidisciplinary metrics for
            integrated solutions. Distinctively re-engineer next-generation
            collaboration and idea-sharing through an expanded array of schemas.
            Energistically seize standardized methods of empowerment with
            transparent paradigms. Phosfluorescently extend client-based
            e-markets with.
          </p>
          <p>
            Collaboratively unleash sustainable niches after covalent solutions.
            Conveniently maintain performance based channels before
            best-of-breed platforms. Holisticly target seamless total linkage
            without high-quality intellectual capital. Monotonectally supply
            bleeding-edge imperatives vis-a-vis enterprise bandwidth.
            Assertively unleash cross-unit results rather than interdependent
            resources. Intrinsicly.
          </p>
          <p>
            Professionally disintermediate transparent scenarios with corporate
            services. Appropriately optimize e-business value after cost
            effective infomediaries. Professionally communicate ethical services
            after turnkey partnerships. Competently procrastinate goal-oriented
            niches for 2.0 materials. Assertively network market-driven
            scenarios before sticky experiences. Objectively predominate
            pandemic value.
          </p>
          <p>
            Synergistically re-engineer team building growth strategies
            vis-a-vis vertical quality vectors. Compellingly provide access to
            alternative potentialities vis-a-vis prospective e-commerce.
            Credibly synergize tactical sources vis-a-vis enterprise supply
            chains. Synergistically streamline holistic functionalities whereas
            market positioning alignments. Compellingly customize
            clicks-and-mortar technologies rather.
          </p>
          <p>
            Distinctively extend best-of-breed leadership without cutting-edge
            core competencies. Holisticly repurpose granular markets with
            web-enabled e-commerce. Enthusiastically streamline interactive
            total linkage before technically sound collaboration and
            idea-sharing. Globally synergize client-centric potentialities
            whereas functional total linkage. Objectively engage multimedia
            based networks through.
          </p>
          <p>
            Conveniently pursue market-driven solutions before B2B users.
            Assertively deploy open-source web services via professional testing
            procedures. Credibly underwhelm progressive manufactured products
            before cross-media niches. Rapidiously maintain stand-alone services
            without inexpensive technology. Phosfluorescently streamline
            extensive human capital without extensive communities.
            Collaboratively.
          </p>
          <p>
            Credibly architect emerging models rather than enterprise
            opportunities. Competently engage high-quality processes for
            synergistic technology. Objectively foster optimal users rather than
            revolutionary deliverables. Phosfluorescently initiate backend
            mindshare rather than distinctive potentialities. Monotonectally
            transition installed base resources with unique technology.
            Compellingly.
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button
            variant="secondary"
            aria-label="Secondary Button"
            onClick={(): void => {
              setOpen(false);
            }}
            mr={2}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            aria-label="Primary Button"
            onClick={action("clicked")}
          >
            Submit
          </Button>
        </Modal.Actions>
      </ComplexModal>
    </>
  );
};
