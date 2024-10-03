import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';  // Import SecureStore

// Create a new context
const ProfileContext = createContext();

// Create a provider component
const ProfileDataProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  // Load profile from secure storage when the app starts
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await SecureStore.getItemAsync('userProfile');
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile)); // Parse stored string back to object
        }
      } catch (error) {
        console.error('Error loading profile from secure storage', error);
      }
    };

    loadProfile();
  }, []);

  // Save profile to secure storage
  const updateProfile = async (newProfile) => {
    try {
      const profileString = JSON.stringify(newProfile);  // Convert object to string
      await SecureStore.setItemAsync('userProfile', profileString);  // Store string in secure storage
      setProfile(newProfile);  // Update state
    } catch (error) {
      console.error('Error saving profile to secure storage', error);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export { ProfileContext, ProfileDataProvider };
