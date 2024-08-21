import { BASE_URL } from '../../constants/Constants';
import AuthTokenStore from '../../../AuthTokenStore';

const AggregatorAssignedItemController = {
  index: async(assignmentId) => {
    try{
      const base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken(); 
      const response = await fetch(`${base_url}aggregator-assigned-items/${assignmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (response.status === 200 && data.status_code === 200) {
        return data;
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  },

  create: async (assignmentId, newData) => {
    try {
      const base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken(); 
      const response = await fetch(`${base_url}aggregator-assigned-items/${assignmentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newData),
      });
      const data = await response.json();
      if (response.status === 200 && data.status_code === 201) {
        return data;
      } else {
        throw new Error('Failed to create data');
      }
    } catch (error) {
      console.error('Error creating data:', error);
      return null;
    }
  },

  update: async (itemId, updatedData) => {
    try {
      const base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken(); 
      const response = await fetch(`${base_url}aggregator-assigned-items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();
      if (response.status === 200 && data.status_code === 200) {
        return data;
      } else {
        throw new Error('Failed to update data');
      }
    } catch (error) {
      console.error('Error updating data:', error);
      return null;
    }
  },

  destroy: async (itemId) => {
    try {
      const base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken(); 
      const response = await fetch(`${base_url}aggregator-assigned-items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (response.status === 200 && data.status_code === 200) {
        return data;
      } else {
        throw new Error('Failed to delete data');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      return null;
    }
  }
};

export default AggregatorAssignedItemController;