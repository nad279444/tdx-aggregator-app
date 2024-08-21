// import { BASE_URL } from '../../constants/Constants';
import AuthTokenStore from '../../../AuthTokenStore';

const AggregatorController = {
  index: async () => {
    try {
      let base_url = "https://platform.tdxapp.ai/api/v1/";
      const token  = await AuthTokenStore.getToken(); // Retrieve the token using getToken from your authentication module
      let response = await fetch(`${base_url}aggregators`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the request headers
        }
      });

      // const data = await response.json();
      // console.log(response.json());
      let data = await response.json();

      if (data.status_code === 200) {
        return data;
      } else {
        // throw new Error(data.error || 'Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching:', error);
      return null;
    }
  },

  show: async(aggregatorId) => {
    try {
      let base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken(); 
      const response = await fetch(`${base_url}aggregators/${aggregatorId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      // console.log(data);
      if(response.status === 200 && data.status_code === 200) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching aggregator:', error);
      return null;
    }
  },

  create: async (newAggregatorData) => {
    try {
      let base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken(); 
      const response = await fetch(`${base_url}aggregators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newAggregatorData)
      });
      const data = await response.json();
      if (response.status === 201 && data.status_code === 201) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to create aggregator');
      }
    } catch (error) {
      console.error('Error creating aggregator:', error);
      return null;
    }
  },

  update: async (aggregatorId, updatedAggregatorData) => {
    // console.log("---------------------------------------------------------");
    // console.log("data before submission",updatedAggregatorData.data);
    // console.log("---------------------------------------------------------");
    try{
      // console.log("---------------------------------------------------------")
      // console.log("what we are sending to the server",updatedAggregatorData.data);
      let base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken(); 
      const userID = await AuthTokenStore.getUserID(); 
      const response = await fetch(`${base_url}aggregators/${userID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedAggregatorData.data)
      });
      
      // if (!response.ok) {
      //   throw new Error('Failed to update aggregator');
      // }
      
      const data = await response.json();
      console.log(data);
      if(data.status_code === 200) {
        return data;
      } else {
        // throw new Error(data.errors);
        // console.log("RESP----------------",data.errors,"-------------------");
        return data;
      }
    } catch (error) {
      console.error('Error updating aggregator:', error);
      return null;
    }
  },

  destroy: async (aggregatorId) => {
    try {
      let base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken(); 
      const response = await fetch(`${base_url}aggregators/${aggregatorId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.status === 200 && data.status_code === 200) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to delete aggregator');
      }
    } catch (error) {
      console.error('Error deleting aggregator:', error);
      return null;
    }
  },

  getAggregatorAssignment: async (requestParams) => {
    try {
      let base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken(); 
      const response = await fetch(`${base_url}aggregator-assignment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestParams)
      });
      const data = await response.json();
      if (response.status === 200 && data.status_code === 200) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to fetch aggregator assignment data');
      }
    } catch (error) {
      console.error('Error fetching aggregator assignment data:', error);
      return null;
    }
  },

  getAggregatorAssignedItem: async (id, requestParams) => {
    try {
      let base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken(); 
      const response = await fetch(`${base_url}aggregator-assigned-item/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestParams)
      });
      const data = await response.json();
      if (response.status === 200 && data.status_code === 200) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to fetch aggregator assigned item data');
      }
    } catch (error) {
      console.error('Error fetching aggregator assigned item data:', error);
      return null;
    }
  },

  getAggregatorAnalytics: async (id,month, year) => {
    try {
      const base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken(); // Assuming AuthTokenStore handles token retrieval
  
      const response = await fetch(`${base_url}aggregators/${id}/analytics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });
  
      const data = await response.json();
      // console.log("Response from API:", data);
  
      if (response.status === 200 && data.status_code === 200) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to fetch aggregator analytics data');
      }
    } catch (error) {
      console.error('Error fetching aggregator analytics data:', error);
      return null;
    }
  }

};

export default AggregatorController;