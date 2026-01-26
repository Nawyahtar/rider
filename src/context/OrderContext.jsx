import React, { createContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(null); // Initially no order

  return (
    <OrderContext.Provider value={{ currentOrder, setCurrentOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
