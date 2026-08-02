import type { ComponentProps, ReactElement } from "react";
import Modal from "./Modal";

const ConfirmModal = (props: ComponentProps<typeof Modal>): ReactElement => {
  return <Modal size="tiny" {...props} />;
};

export default ConfirmModal;
