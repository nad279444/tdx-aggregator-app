// import { BASE_URL } from '../../constants/Constants';
import AuthTokenStore from '../../../AuthTokenStore';

const AggregationController = {
  
  update: async (id, updatedAggregationData) => {
    try{
      let base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken(); 
      const userID = await AuthTokenStore.getUserID(); 
      const response = await fetch(`${base_url}farmer-assignment/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedAggregationData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update aggregation data');
      }
      
      const data = await response.json();
      
      if(data.status_code === 200) {
        return data;
      } else {
        // throw new Error(data.errors);
        // console.log("RESP----------------",data.errors,"-------------------");
      }
    } catch (error) {
      console.error('Error updating aggregator:', error);
      return null;
    }
  },

  destroy: async (id) => {
    try {
      let base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken(); 
      const response = await fetch(`${base_url}farmer-assignment/${id}`, {
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

  
};

export default AggregationController;