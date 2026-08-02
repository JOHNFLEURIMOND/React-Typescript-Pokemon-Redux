import type { ComponentProps, ReactElement } from "react";
import Modal from "./Modal";

const ComplexModal = (props: ComponentProps<typeof Modal>): ReactElement => {
  return <Modal size="large" {...props} />;
};

export default ComplexModal;
