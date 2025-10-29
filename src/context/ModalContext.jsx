import React, { createContext, useState } from "react";
import ModalWrapper from "../components/common/ModalWrapper";

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);
  const [modalProps, setModalProps] = useState({});

  const openModal = (content, props = {}) => {
    setModalContent(content);
    setModalProps(props);
  };

  const closeModal = () => {
    setModalContent(null);
    setModalProps({});
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalProps }}>
      {children}
      {modalContent && <ModalWrapper>{modalContent}</ModalWrapper>}
    </ModalContext.Provider>
  );
};
