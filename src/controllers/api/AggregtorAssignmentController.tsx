import axios from 'axios';
import { BASE_URL } from '../../constants/Constants';
import AuthTokenStore from '../../../AuthTokenStore';

const base_url = "https://platform.tdxapp.ai/api/v1/";

const AggregatorAssignmentController = {
  index: async (page) => {
    try {
      let token = await AuthTokenStore.getToken();
      const response = await fetch(`${base_url}aggregator-assignments?page=${page}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      // console.log("assignment data for aggregator",data);
      if (response.status === 200 && data.status_code === 200) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  },

  specific: async (userId,page) => {
    try {
      let token = await AuthTokenStore.getToken();
      const response = await fetch(`${base_url}aggregator-assignments/specific/${userId}?page=${page}`,{
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.status === 200 && data.status_code === 200) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  },

  show: async (assignmentId) => {
    try {
      let token = await AuthTokenStore.getToken();
      const response = await fetch(`${base_url}aggregator-assignments/${assignmentId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.status === 200 && data.status_code === 200) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  },

  store: async (newAssignmentData) => {
    try {
      let token = await AuthTokenStore.getToken();
      const response = await fetch(`${base_url}aggregator-assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAssignmentData),
      });
      const data = await response.json();
      if (response.status === 201 && data.status_code === 201) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to create data');
      }
    } catch (error) {
      console.error('Error creating data:', error);
      return null;
    }
  },

  update: async (assignmentId, updatedAssignmentData) => {
    try {
      let token = await AuthTokenStore.getToken();
      const response = await fetch(`${base_url}aggregator-assignments/${assignmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedAssignmentData),
      });
      const data = await response.json();
      if (response.status === 200 && data.status_code === 200) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to update data');
      }
    } catch (error) {
      console.error('Error updating data:', error);
      return null;
    }
  },

  destroy: async (assignmentId) => {
    try {
      let token = await AuthTokenStore.getToken();
      const response = await fetch(`${base_url}aggregator-assignments/${assignmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.status === 200 && data.status_code === 200) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to delete data');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      return null;
    }
  }
};

export default AggregatorAssignmentController;