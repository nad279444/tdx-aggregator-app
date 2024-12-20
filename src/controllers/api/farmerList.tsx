import { FARMERLIST, FINDFARMER, ADDFARMER } from "../../constants/Constants";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system";
import { fetchAndSaveJson, syncJson,offlineLoad } from "../../functions/getOfflineUtils";
import { normalizeFarmerData } from "../../functions/normalization";
import { storeOfflineRequest,retryOfflineRequests } from "../../functions/postOfflineUtils";



export const farmers = {
  fileName: "farmers.json",
  filePath: `${FileSystem.documentDirectory}farmers.json`,
  addFarmerFilePath: `${FileSystem.documentDirectory}orderOffline.json`,
  fetchAndSync: async () => {
    try {
      await fetchAndSaveJson(FARMERLIST, farmers.filePath,normalizeFarmerData);
      await syncJson(
        FARMERLIST,
        farmers.filePath,
        farmers.loadJsonFromFile,
        normalizeFarmerData
      );
    } catch (error) {
      console.error("Failed to fetch commodities:", error.message);
      throw error;
    }
  },
  // Load JSON data from local file storage
  loadJsonFromFile: async () => {
    try {
      return await offlineLoad(FARMERLIST,farmers.filePath,normalizeFarmerData)
    } catch (error) {
      console.error("Error loading file:", error.message);
      return null;
    }
  },
  getOne: async (find) => {
    try {
      // Retrieve the access token from secure storage
      const access_token = await SecureStore.getItemAsync("accessToken");
      const user_token = await SecureStore.getItemAsync("userToken");

      if (!access_token || !user_token) {
        throw new Error("Missing access token or user token");
      }

      // Make the API request to find the farmer using the mobile number
      const response = await axios.post(
        `${FINDFARMER}/${user_token}`,
        {
          find,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Failed to fetch farmer with mobile number ${find}:`,
        error.message
      );
      throw error;
    }
  },
  add: async (farmer) => {
    try {
      // Retrieve the access token from secure storage
      const access_token = await SecureStore.getItemAsync("accessToken");
      const user_token = await SecureStore.getItemAsync("userToken");

      if (!access_token || !user_token) {
        throw new Error("Missing access token or user token");
      }

      // Make the API request to find the farmer using the mobile number
      const response = await axios.post(`${ADDFARMER}/${user_token}`,farmer,{
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (!error.response && (error.code === "ECONNABORTED" || error.message.includes("Network Error"))) {
        await storeOfflineRequest(farmers.addFarmerFilePath, { ADDFARMER, farmer });
        await retryOfflineRequests(farmers.addFarmerFilePath)
      } else {
        console.error("Non-network error occurred:", error);
        throw error;
      }
      
    }
  },
};
