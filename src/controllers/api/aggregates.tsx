import { AGGREGATES,DASHBOARD,QUANTITYDATA } from "../../constants/Constants";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from "expo-file-system";
import { fetchAndSaveJson, syncJson ,offlineLoad} from "../../functions/getOfflineUtils";
import { normalizeDashboardData,normalizeArray } from "../../functions/normalization";

export const aggregates = {
    getQuantities: async () => {
        try {
            // Retrieve tokens from secure storage
            const access_token = await SecureStore.getItemAsync('accessToken');
            const user_token = await SecureStore.getItemAsync('userToken');
        

            if (!access_token || !user_token) {
                throw new Error('Missing access token or user token');
            }

            // Make the API request
            const response = await axios.get(`${QUANTITYDATA}/${user_token}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch quantities:', error.message);
            throw error;
        }
    },
};


export const dashboard = {
    fileName: "dashboard.json",
    filePath: `${FileSystem.documentDirectory}dashboard.json`,
    fetchAndSync: async () => {
      try {
        await fetchAndSaveJson(DASHBOARD, dashboard.filePath,normalizeDashboardData);
        await syncJson(
          DASHBOARD,
          dashboard.filePath,
          dashboard.loadJsonFromFile,
          normalizeDashboardData
        );
      } catch (error) {
        console.error("Failed to fetch dashboard values:", error.message);
        throw error;
      }
    },
    // Load JSON data from local file storage
    loadJsonFromFile: async () => {
      try {
      return await offlineLoad(DASHBOARD,dashboard.filePath,normalizeDashboardData)
      } catch (error) {
        console.error("Error loading file:", error.message);
        return null;
      }
    },
    
  };
  
  export const aggregationOrder = {
    fileName: "aggregates.json",
    filePath: `${FileSystem.documentDirectory}aggregates.json`,
    fetchAndSync: async () => {
      try {
        await fetchAndSaveJson(AGGREGATES, aggregationOrder.filePath,normalizeArray);
        await syncJson(
          AGGREGATES,
          aggregationOrder.filePath,
          aggregationOrder.loadJsonFromFile,
          normalizeArray
        );
      } catch (error) {
        console.error("Failed to fetch dashboard values:", error.message);
        throw error;
      }
    },
    // Load JSON data from local file storage
    loadJsonFromFile: async () => {
      try {
      return await offlineLoad(AGGREGATES,aggregationOrder.filePath,normalizeArray)
      } catch (error) {
        console.error("Error loading file:", error.message);
        return null;
      }
    },
  }
  