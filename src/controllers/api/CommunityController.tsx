import { BASE_URL } from '../../constants/Constants';
import AuthTokenStore from '../../../AuthTokenStore';

const CommunityController = {
  index: async (page) => {
    try {
      const base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken();
      const response = await fetch(`${base_url}commodity?page=${page}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.status_code === 200) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to fetch commodities');
      }
    } catch (error) {
      console.error('Error fetching commodities:', error);
      return null;
    }
  },

  show: async (id) => {
    try {
      const token = await AuthTokenStore.getToken();
      const base_url = "https://platform.tdxapp.ai/api/v1/";
      const response = await fetch(`${base_url}community/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.status_code === 200) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to fetch commodity');
      }
    } catch (error) {
      console.error('Error fetching commodity:', error);
      return null;
    }
  },

  store: async (newCommunityData, aggregatorId) => {
    try {
      const token = await AuthTokenStore.getToken();
      const base_url = "https://platform.tdxapp.ai/api/v1/";
      const response = await fetch(`${base_url}commodity/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCommunityData)
      });
      const data = await response.json();
      // console.log("actual response:",data);
      if (response.ok && data.status_code === 200) {
        return data; // Assuming 'community' is the key for the created commodity object in the response
      } else {
        
        throw new Error(data.message || 'Failed to create community');
      }
    } catch (error) {
      console.error('Error creating community:', error);
      return null;
    }
  },

  update: async (id,updatedCommunityData) => {
    try {
      const token = await AuthTokenStore.getToken();
      const base_url = "https://platform.tdxapp.ai/api/v1/";
      const response = await fetch(`${base_url}community/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedCommunityData)
      });

      const data = await response.json();
      if (response.ok && data.status_code === 200) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to update community');
      }
    } catch (error) {
      console.error('Error updating community:', error);
      return null;
    }
  },

  destroy: async (id) => {
    try {
      const token = await AuthTokenStore.getToken();
      const base_url = "https://platform.tdxapp.ai/api/v1/";
      const response = await fetch(`${base_url}community/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.status_code === 200) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to delete community');
      }
    } catch (error) {
      console.error('Error deleting community:', error);
      return null;
    }
  },
};

export default CommunityController;