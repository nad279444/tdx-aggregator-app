import { AUTO_CALCULATOR } from "../../constants/Constants";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const autoCalculator = {
    get: async (quantity,commodity) => {
        try {
            // Retrieve tokens from secure storage
            const access_token = await SecureStore.getItemAsync('accessToken');
            const user_token = await SecureStore.getItemAsync('userToken');
        

            if (!access_token || !user_token) {
                throw new Error('Missing access token or user token');
            }

            // Make the API request
            const response = await axios.post(`${AUTO_CALCULATOR}/${user_token}`, {quantity,commodity},{
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch farmers:', error.message);
            throw error;
        }
    }
};


