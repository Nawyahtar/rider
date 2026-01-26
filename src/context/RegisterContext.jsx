// src/context/RegisterContext.js
import React, { createContext, useState } from 'react';

export const RegisterContext = createContext();

export const RegisterProvider = ({ children }) => {
  const [registerData, setRegisterData] = useState({
    info: {},
    step2: {},
    document: {},
  });

  const updateStepData = (stepKey, data) => {
    setRegisterData(prev => ({
      ...prev,
      [stepKey]: data, // full replace
    }));
  };

  const resetRegisterData = () => {
    setRegisterData({
      info: {},
      step2: {},
      document: {},
    });
  };

  return (
    <RegisterContext.Provider
      value={{ registerData, updateStepData, resetRegisterData }}
    >
      {children}
    </RegisterContext.Provider>
  );
};
