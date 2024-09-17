import React, { useState, useEffect, createContext, useContext } from "react";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";

// Create DataContext for providing access to data throughout the app
export const DataContext = createContext();

// Custom hook to use the DataContext easily
export const useDataContext = () => useContext(DataContext);

// DataProvider Component with SQLiteProvider and context management
export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    farmerToken:"",
    commodity: "",
    commodityId: "",
    communityId: "",
    siloId:"",
    weight: "",
    bags: "",
    totalPrice: 0,
    farmerName: "",
    phoneNumber: "",
    idCardPhoto: "",
    altName: "",
    altNumber: "",
    qualityControlChecks:"",
  });

  // Get database context from SQLiteProvider
  const db = useSQLiteContext();

  useEffect(() => {
    initializeDatabase();
  }, []);

  // Initialize Database and Tables
  const initializeDatabase = async () => {
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS formData (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT UNIQUE,
          value TEXT
        );
      `);

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS farmers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        main_number TEXT NOT NULL, 
        alt_number TEXT     
);

      `);

      // Load initial data from the formData table
      loadDataFromDB();
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  };

  // Load formData from the database
  const loadDataFromDB = async () => {
    try {
      const rows = await db.getAllAsync("SELECT * FROM formData");
      const loadedData = {};
      rows.forEach((item) => {
        loadedData[item.key] = item.value;
      });
      setData(loadedData);
    } catch (error) {
      console.error("Error loading data from database:", error);
    }
  };

  // Update formData and save changes to the database
  const updateData = async (key, value) => {
    try {
      setData((prevState) => ({ ...prevState, [key]: value }));

      await db.runAsync(
        "INSERT OR REPLACE INTO formData (key, value) VALUES (?, ?)",
        [key, value]
      );
      console.log("Data updated successfully");
    } catch (error) {
      console.error("Error updating data in database:", error);
    }
  };

  // Add a new farmer to the farmers table
  const addFarmer = async (
    token,
    first_name,
    last_name,
    main_number,
    alt_number,
    imageUri
  ) => {
    try {
      await db.runAsync(
        "INSERT INTO farmers (token, first_name,last_name,main_number,alt_number,imageUri) VALUES (?, ?, ?,?,?,?)",
        [token, first_name, last_name, main_number, alt_number, imageUri]
      );
      console.log("Farmer added successfully");
      return await getFarmers();
    } catch (error) {
      console.error("Error adding farmer:", error);
    }
  };

  // Fetch all farmers from the database
  const getFarmers = async () => {
    try {
      const result = await db.getAllAsync("SELECT * FROM farmers");
      return result;
    } catch (error) {
      console.error("Error fetching farmers:", error);
      return [];
    }
  };

  return (
    <DataContext.Provider value={{ data, updateData, addFarmer, getFarmers }}>
      {children}
    </DataContext.Provider>
  );
};
