import * as FileSystem from "expo-file-system";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

// Function to fetch and save JSON
export async function communityFetchAndSaveJson(url, filePath, normalizeData) {
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    const normalizedData = normalizeData(response.data);
    await FileSystem.writeAsStringAsync(
      filePath,
      JSON.stringify(normalizedData),
      {
        encoding: FileSystem.EncodingType.UTF8,
      }
    );
    console.log("File saved to:", filePath);

    return normalizedData;
  } catch (error) {
    console.error("Failed to fetch and save JSON:", error.message);
    throw error;
  }
}

// Function to sync JSON
export const communitySyncJson = async (
  url,
  filePath,
  loadJson,
  normalizeData
) => {
  try {
    const localData = await loadJson();
    const localSync = localData?.lastSynced || null;

    const response = await axios.get(
      url,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const normalizedData = normalizeData(response.data);
    const serverSync = normalizedData.lastSynced;

    if (!localSync || new Date(serverSync) > new Date(localSync)) {
      console.log("Updating local data with server data...");
      await communityFetchAndSaveJson(url, filePath, normalizeData);
    } else {
      console.log("Local data is up to date.");
    }
  } catch (error) {
    console.error("Error syncing data:", error.message);
  }
};

// Function for offline load
export const communityOfflineLoad = async (url, filePath, normalizeData) => {
  try {
    const fileExists = await FileSystem.getInfoAsync(filePath);

    if (fileExists.exists) {
      const data = await FileSystem.readAsStringAsync(filePath, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      console.log("Loaded data from file:", data);

      const jsonData = JSON.parse(data);
      return jsonData;
    } else {
      return await communityFetchAndSaveJson(url, filePath, normalizeData);
    }
  } catch (error) {
    console.error("Error loading file:", error.message);
    return null;
  }
};
