import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import { JSONBLOB } from '../../constants/Constants';
import NetInfo from '@react-native-community/netinfo';

export const jsonFile = {
    fileName: 'jsonBlob.json',
    filePath: `${FileSystem.documentDirectory}jsonBlob.json`,

    // Fetch and Save JSON data from server
    fetchAndSaveJson: async () => {
        try {
            const access_token = await SecureStore.getItemAsync('accessToken');
            const user_token = await SecureStore.getItemAsync('userToken');
        
            if (!access_token || !user_token) {
                throw new Error('Missing access token or user token');
            }

            const response = await axios.post(
                `${JSONBLOB}/${user_token}`,{"type":"json"} ,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'Content-Type': 'application/json', 
                    },
                }
            );

            const data = response.data;
        

            // Save JSON data as a string in the file
            await FileSystem.writeAsStringAsync(jsonFile.filePath, JSON.stringify(data), {
                encoding: FileSystem.EncodingType.UTF8,
            });
            console.log('File saved to:', jsonFile.filePath);

        } catch (error) {
            console.error('Failed to fetch and save JSON:', error.message);
            throw error;
        }
    },

    // Load JSON data from local file storage
    loadJsonFromFile: async () => {
        try {
            const fileExists = await FileSystem.getInfoAsync(jsonFile.filePath);

            if (fileExists.exists) {
                const data = await FileSystem.readAsStringAsync(jsonFile.filePath, {
                    encoding: FileSystem.EncodingType.UTF8,
                });
                console.log("Loaded data from file:", data);

                const jsonData = JSON.parse(data);
    

    
                return jsonData;
            } else {
                console.log('File does not exist');
                return null
            }
        } catch (error) {
            console.error('Error loading file:', error.message); 
            return null;
        }
    },

    // Sync data with server if newer version exists
    syncData: async () => {
        try {
            // Load local JSON data
            const localData = await jsonFile.loadJsonFromFile();
            const localSync = localData?.last_synced || null;

            // Retrieve tokens
            const access_token = await SecureStore.getItemAsync('accessToken');
            const user_token = await SecureStore.getItemAsync('userToken');

            if (!access_token || !user_token) {
                throw new Error('Missing access token or user token');
            }

            // Fetch server data
            const response = await axios.post(
                `${JSONBLOB}/${user_token}`, 
                { type: 'json' },
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );

            const data = response.data;
            const serverSync = data.last_synced;

            // Compare timestamps and update if needed
            if (!localSync || new Date(serverSync) > new Date(localSync)) {
                console.log('Updating local data with server data...');
                await jsonFile.fetchAndSaveJson();
            } else {
                console.log('Local data is up to date.');
            }
        } catch (error) {
            console.error('Error syncing data:', error.message);
        }
    }
};

// Example usage: Sync data when network is connected
NetInfo.addEventListener(state => {
    if (state.isConnected) {
        jsonFile.syncData();
    }
});
