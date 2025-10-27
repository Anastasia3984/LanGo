import React from "react";
import styles from "./ModalWrapper.module.css";
import { useModal } from "../../hooks/useModal";
import { CloseButton } from "./CloseButton";

const ModalWrapper = ({ children }) => {
  const { closeModal, modalProps } = useModal();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const childrenWithProps = React.cloneElement(children, {
    closeModal,
    ...modalProps,
  });

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer}>
        <CloseButton onClick={closeModal} className={styles.closeButton} />
        {childrenWithProps}
      </div>
    </div>
  );
};

export default ModalWrapper;
