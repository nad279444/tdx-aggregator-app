import { NOTIFICATIONS } from "../../constants/Constants";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from "expo-file-system";
import { fetchAndSaveJson,syncJson,offlineLoad } from "../../functions/getOfflineUtils";
import { normalizeArray } from "../../functions/normalization";

export const notifications = {
    filePath: `${FileSystem.documentDirectory}notifications.json`,
    fetchAndSync: async () => {
        try {
          await fetchAndSaveJson(NOTIFICATIONS, notifications.filePath,normalizeArray);
          await syncJson(
            NOTIFICATIONS,
            notifications.filePath,
            notifications.loadJsonFromFile,
            normalizeArray
          );
        } catch (error) {
          console.error("Failed to fetch notifications:", error.message);
          throw error;
        }
      },
      // Load JSON data from local file storage
      loadJsonFromFile: async () => {
        try {
          return await offlineLoad(NOTIFICATIONS,notifications.filePath,normalizeArray)
        } catch (error) {
          console.error("Error loading file:", error.message);
          return null;
        }
      },
    post: async (notificationId) => {
        try {
             // Retrieve tokens from secure storage
             const access_token = await SecureStore.getItemAsync('accessToken');
             const user_token = await SecureStore.getItemAsync('userToken');
         
 
             if (!access_token || !user_token) {
                 throw new Error('Missing access token or user token');
             }
 
             // Make the API request
             const response = await axios.post(`${NOTIFICATIONS}/${user_token}?read=${notificationId}`,{},{
                 headers: {
                     Authorization: `Bearer ${access_token}`,
                 },
             });
             return response.data;
        } catch (error) {
            console.error('Failed to send read notifications:', error.message);
            throw error; 
        }
    }

};


