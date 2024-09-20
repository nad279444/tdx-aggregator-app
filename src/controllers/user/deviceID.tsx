import { EDIT_USER } from "../../constants/Constants";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

export const sendDeviceToken = {
  sendToken: async () => {
    try {
      // Retrieve tokens from secure storage
      const device_token = await SecureStore.getItemAsync("deviceToken");
      const access_token = await SecureStore.getItemAsync("accessToken");
      const user_token = await SecureStore.getItemAsync("userToken");

      if (!device_token) {
        throw new Error("Missing access device token");
      }
      if (!access_token || !user_token) {
        throw new Error("Missing access token or user token");
      }

      const response = await axios.get(`${EDIT_USER}/${user_token}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch notifications:", error.message);
      throw error;
    }
  },
};
