import type { ComponentProps, ReactElement } from "react";
import Modal from "./Modal";

const SimpleModal = (props: ComponentProps<typeof Modal>): ReactElement => {
  return <Modal size="small" {...props} />;
};

export default SimpleModal;
