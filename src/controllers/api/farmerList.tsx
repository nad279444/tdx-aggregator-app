import { FARMERLIST, FINDFARMER, ADDFARMER } from "../../constants/Constants";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const farmers = {
  get: async () => {
    try {
      // Retrieve tokens from secure storage
      const access_token = await SecureStore.getItemAsync("accessToken");
      const user_token = await SecureStore.getItemAsync("userToken");

      if (!access_token || !user_token) {
        throw new Error("Missing access token or user token");
      }

      // Make the API request to get all farmers
      const response = await axios.get(`${FARMERLIST}/${user_token}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch farmers:", error.message);
      throw error;
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
      const response = await axios.post(`${ADDFARMER}/${user_token}`, farmer, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch farmer w `, error.message);
      throw error;
    }
  },
};
