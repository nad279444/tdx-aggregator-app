import { ORDERS,ORDER_STATISTICS,ALLORDERS} from "../../constants/Constants";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from "expo-file-system";
import { fetchAndSaveJson, syncJson ,offlineLoad} from "../../functions/getOfflineUtils";
import { normalizeArray } from "../../functions/normalization";


export const orders = {
    
    post: async (order) => {
        try {
            // Retrieve the access token from secure storage
            const access_token = await SecureStore.getItemAsync('accessToken');
            const user_token = await SecureStore.getItemAsync('userToken');
        
            if (!access_token || !user_token) {
                throw new Error('Missing access token or user token');
            }
            
            // Make the API request to make an order
            const response = await axios.post(`${ORDERS}/${user_token}`,order,
                {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch order:`, error.message);
            throw error;
        }
    },
    get: async () => {
        try {
            // Retrieve tokens from secure storage
            const access_token = await SecureStore.getItemAsync('accessToken');
            const user_token = await SecureStore.getItemAsync('userToken');
        

            if (!access_token || !user_token) {
                throw new Error('Missing access token or user token');
            }

            // Make the API request
            const response = await axios.get(`${ORDER_STATISTICS}/${user_token}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch order statistics:', error.message);
            throw error;
        }
    },
   

};

export const getAllOrders = {
    fileName: "allOrders.json",
    filePath: `${FileSystem.documentDirectory}allOrders.json`,
    fetchAndSync: async () => {
      try {
        await fetchAndSaveJson(ALLORDERS, getAllOrders.filePath,normalizeArray);
        await syncJson(
        ALLORDERS,
          getAllOrders.filePath,
          getAllOrders.loadJsonFromFile,
          normalizeArray
        );
      } catch (error) {
        console.error("Failed to fetch commodities:", error.message);
        throw error;
      }
    },
    // Load JSON data from local file storage
    loadJsonFromFile: async () => {
      try {
      return await offlineLoad(ALLORDERS,getAllOrders.filePath,normalizeArray)
      } catch (error) {
        console.error("Error loading file:", error.message);
        return null;
      }
    },
}
