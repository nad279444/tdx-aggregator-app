import { COMMUNITIES,COMMUNITY_RATES } from "../../constants/Constants";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const communities = {
    get: async () => {
        try {
            // Retrieve tokens from secure storage
            const access_token = await SecureStore.getItemAsync('accessToken');
            const user_token = await SecureStore.getItemAsync('userToken');
        

            if (!access_token || !user_token) {
                throw new Error('Missing access token or user token');
            }

            // Make the API request
            const response = await axios.get(`${COMMUNITIES}/${user_token}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch farmers:', error.message);
            throw error;
        }
    },
    getRates: async () => {
        try {
            // Retrieve tokens from secure storage
            const access_token = await SecureStore.getItemAsync('accessToken');
            const user_token = await SecureStore.getItemAsync('userToken');
        

            if (!access_token || !user_token) {
                throw new Error('Missing access token or user token');
            }

            // Make the API request
            const response = await axios.get(`${COMMUNITY_RATES}/${user_token}`, {
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


