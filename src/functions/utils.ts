import * as FileSystem from "expo-file-system";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const normalizeData = (data) => {
    let dataArray;
    let lastSyncedObject;
  
    // Check if data is an array or an object
    if (Array.isArray(data)) {
      // If data is an array, find and filter last_synced as you currently have it
      lastSyncedObject = data.find((item) => item.last_synced);
      dataArray = data.filter((item) => !item.last_synced);
    } else if (typeof data === 'object' && data.data) {
      // If data is an object with a 'data' property, use data.data array
      lastSyncedObject = data.data.find((item) => item.last_synced);
      dataArray = data.data.filter((item) => !item.last_synced);
    } else {
      // Handle the case where data is neither an array nor an expected object structure
      throw new Error("Invalid data format. Expected an array or an object with a 'data' property.");
    }
  
    // Extract the last_synced date
    const lastSynced = lastSyncedObject ? new Date(lastSyncedObject.last_synced) : null;
  
    return {
      data: dataArray,
      lastSynced: lastSynced,
    };
  };
  

export async function fetchAndSaveJson(url, filePath) {
  try {
    const access_token = await SecureStore.getItemAsync("accessToken");
    const user_token = await SecureStore.getItemAsync("userToken");

    if (!access_token || !user_token) {
      throw new Error("Missing access token or user token");
    }

    const response = await axios.get(`${url}/${user_token}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });

    const data = response.data;
    const normalizedData = normalizeData(data);

    // Save JSON data as a string in the file
    await FileSystem.writeAsStringAsync(
      filePath,
      JSON.stringify(normalizedData),
      {
        encoding: FileSystem.EncodingType.UTF8,
      }
    );
    console.log("File saved to:", filePath);
  } catch (error) {
    console.error("Failed to fetch and save JSON:", error.message);
    throw error;
  }
}

export const syncJson = async (url, filePath, loadJson) => {
  try {
    // Load local JSON data
    const localData = await loadJson();
    const localSync = localData?.lastSynced || null;

    // Retrieve tokens
    const access_token = await SecureStore.getItemAsync("accessToken");
    const user_token = await SecureStore.getItemAsync("userToken");

    if (!access_token || !user_token) {
      throw new Error("Missing access token or user token");
    }

    // Fetch server data
    const response = await axios.post(
      `${url}/${user_token}`,
      { type: "json" },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const data = response.data;
    const normalizedData = normalizeData(data);
    const serverSync = normalizedData.lastSynced;

    // Compare timestamps and update if needed
    if (!localSync || new Date(serverSync) > new Date(localSync)) {
      console.log("Updating local data with server data...");
      await fetchAndSaveJson(url, filePath);
    } else {
      console.log("Local data is up to date.");
    }
  } catch (error) {
    console.error("Error syncing data:", error.message);
  }
};

