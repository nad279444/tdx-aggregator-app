import React, { createContext, useContext, useState } from 'react';
import farmers from './src/controllers/api/farmerList';
import useApiState from './src/functions/apiHooks';

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
    const [state, setLoading, setSuccess, setError] = useApiState();

    const getAllFarmers = async () => {
        setLoading()
        try {
            const data = await farmers.get()
              setSuccess(data); 
        } catch (error) {
            setError(error.message || 'An error occurred'); 
        }
    };
    return (
        <ApiContext.Provider value={{ getAllFarmers, state }}>
            {children}
        </ApiContext.Provider>
    );
};

// Custom hook to use the ApiContext
export const useApiContext = () => useContext(ApiContext);
