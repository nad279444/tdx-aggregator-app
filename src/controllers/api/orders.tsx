import { ORDERS,ORDER_STATISTICS} from "../../constants/Constants";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

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
    }

};
