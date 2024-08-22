import React, { createContext, useState } from 'react';

// Create a Context
export const DataContext = createContext();

// Create a Provider component with shallow state
export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    commodity: '',
    weight: '',
    bags: '',
    totalPrice:0,
    // Add more fields as needed
  });

  // Update the form data for a specific field
  const updateData = (key, value) => {
    setData(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  return (
    <DataContext.Provider value={{ data, updateData }}>
      {children}
    </DataContext.Provider>
  );
};
