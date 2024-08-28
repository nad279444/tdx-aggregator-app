import React, { createContext, useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

// Create a Context
export const DataContext = createContext();

// Create a Provider component with SQLite integration
export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    commodity: '',
    weight: '',
    bags: '',
    totalPrice: 0,
    farmerName:'',
    phoneNumber:'',
    idCardPhoto:'',
    momoName:'',
    momoNumber:'',
  });

  useEffect(() => {
    const initializeDB = async () => {
      try {
        const db = await SQLite.openDatabaseAsync('appData.db');

        // Create the existing formData table if it doesn't exist
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS formData (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE,
            value TEXT
          );
        `);

        // Create the new farmers table
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS farmers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            phoneNumber TEXT,
            imageUri TEXT
          );
        `);

        // Load initial data from SQLite (for formData)
        loadDataFromDB(db);
      } catch (error) {
        console.error('Error initializing database', error);
      }
    };

    initializeDB();
  }, []);

  // Load data from SQLite and update the context state
  const loadDataFromDB = async (db) => {
    try {
      const rows = await db.getAllAsync('SELECT * FROM formData;');
      const loadedData = {};
      rows.forEach(item => {
        loadedData[item.key] = item.value;
      });
      setData(loadedData);
    } catch (error) {
      console.error('Error loading data from database', error);
    }
  };

  // Update the form data and save it to SQLite
  const updateData = async (key, value) => {
    setData(prevState => {
      const newData = { ...prevState, [key]: value };

      const saveData = async () => {
        try {
          const db = await SQLite.openDatabaseAsync('appData.db');
          await db.runAsync(
            'INSERT OR REPLACE INTO formData (key, value) VALUES (?, ?);',
            key,
            value
          );
          console.log('Data updated successfully');
        } catch (error) {
          console.error('Error updating data in database', error);
        }
      };

      saveData();

      return newData;
    });
  };

  // Add a new farmer to the database
  const addFarmer = async (name, phoneNumber, imageUri) => {
    try {
      const db = await SQLite.openDatabaseAsync('appData.db');
      await db.runAsync(
        'INSERT INTO farmers (name, phoneNumber, imageUri) VALUES (?, ?, ?);',
        name,
        phoneNumber,
        imageUri
      );
      console.log('Farmer added successfully');
    } catch (error) {
      console.error('Error adding farmer to database', error);
    }
  };

  // Fetch all farmers from the database
  const getFarmers = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('appData.db');
      const result = await db.getAllAsync('SELECT * FROM farmers;');
      const farmers = [];

    // Use for await...of to iterate over the results
    for await (const row of result) {
      farmers.push(row);
    }

    return farmers
    } catch (error) {
      console.error('Error fetching farmers from database', error);
      return [];
    }
  };

  return (
    <DataContext.Provider value={{ data, updateData, addFarmer, getFarmers }}>
      {children}
    </DataContext.Provider>
  );
};
