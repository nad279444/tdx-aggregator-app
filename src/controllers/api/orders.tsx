import { ORDERS,ORDER_STATISTICS,ALLORDERS,QUANTITYDATA} from "../../constants/Constants";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from "expo-file-system";
import { fetchAndSaveJson, syncJson ,offlineLoad} from "../../functions/getOfflineUtils";
import { normalizeArray,normalizeDashboardData,normalizeOrder } from "../../functions/normalization";
import { retryOfflineRequests,storeOfflineRequest } from "../../functions/postOfflineUtils";


export const orders = {
    orderOfflinePath: `${FileSystem.documentDirectory}orderOffline.json`,
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
            if (!error.response && (error.code === "ECONNABORTED" || error.message.includes("Network Error"))) {
                await storeOfflineRequest(orders.orderOfflinePath, { ORDERS, order });
                await retryOfflineRequests(orders.orderOfflinePath)
              } else {
                console.error("Non-network error occurred:", error);
                throw error;
              }
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


export const orderstats = {
    fileName: "orderstats.json",
    filePath: `${FileSystem.documentDirectory}orderstats.json`,
    fetchAndSync: async () => {
      try {
        await fetchAndSaveJson(ORDER_STATISTICS, orderstats.filePath,normalizeOrder);
        await syncJson(
        ORDER_STATISTICS,
          orderstats.filePath,
          orderstats.loadJsonFromFile,
          normalizeOrder
        );
      } catch (error) {
        console.error("Failed to fetch order stats:", error.message);
        throw error;
      }
    },
    // Load JSON data from local file storage
    loadJsonFromFile: async () => {
      try {
      return await offlineLoad(ORDER_STATISTICS,orderstats.filePath,normalizeOrder)
      } catch (error) {
        console.error("Error loading file:", error.message);
        return null;
      }
    },
}

export const orderqtystats = {
    fileName: "orderqtystats.json",
    filePath: `${FileSystem.documentDirectory}orderqtystats.json`,
    fetchAndSync: async () => {
      try {
        await fetchAndSaveJson(QUANTITYDATA, orderqtystats.filePath,normalizeOrder);
        await syncJson(
        QUANTITYDATA,
          orderqtystats.filePath,
          orderqtystats.loadJsonFromFile,
          normalizeOrder
        );
      } catch (error) {
        console.error("Failed to fetch order quantity  stats:", error.message);
        throw error;
      }
    },
    // Load JSON data from local file storage
    loadJsonFromFile: async () => {
      try {
      return await offlineLoad(QUANTITYDATA,orderqtystats.filePath,normalizeOrder)
      } catch (error) {
        console.error("Error loading file:", error.message);
        return null;
      }
    },
}