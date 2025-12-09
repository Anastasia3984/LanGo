import React from 'react';
import { AuthProvider } from '../../src/context/AuthContext';
import { ModalProvider } from '../../src/context/ModalContext';
import { MemoryRouter } from 'react-router-dom';

const TestProviders = ({ children }) => {
  return (
    <MemoryRouter>
      <AuthProvider>
        <ModalProvider>
          {children}
        </ModalProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

export default TestProviders;