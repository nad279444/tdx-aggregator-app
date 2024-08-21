import axios from 'axios';
import AuthTokenStore from '../../../AuthTokenStore';

const FarmerController = {
  index: async (page,userID) => {
    // ?page=${page}
    const mydata = {user_id:userID}
    try {
      const base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken();
      const response = await fetch(`${base_url}farmers?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body:JSON.stringify(mydata)
      });

      const data = await response.json();
      // console.log("my status: ", data.status_code);
      // console.log("from Json", data.data);

      if (data.status_code === 200) {
        // console.log("data here: farmers", data.data);
        return data;
      } else {
        throw new Error(data.data.error || 'Failed to fetch farmers');
      }
    } catch (error) {
      console.error('Error fetching farmers:', error);
      return null;
    }
  },

  specify: async (page,aggregatorId) => {
    try {
      const token = await AuthTokenStore.getToken();
      let base_url = "https://platform.tdxapp.ai/api/v1/";
      const response = await fetch(`${base_url}farmers/specific/${aggregatorId}?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();
      // console.log(data);
      if (response.ok && data.status_code === 200) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to fetch specific farmers');
      }
    } catch (error) {
      console.error('Error fetching specific farmers:', error);
      return null;
    }
  },

  show: async (farmerId) => {
    try {
      const token = await AuthTokenStore.getToken();
      let base_url = "https://platform.tdxapp.ai/api/v1/";
      const response = await fetch(`${base_url}farmers/${farmerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (response.ok && data.status_code === 200) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to fetch farmer');
      }
    } catch (error) {
      console.error('Error fetching farmer:', error);
      return null;
    }
  },

  store: async (newFarmerData, aggregatorId) => {
    try{
      // console.log("new data to server ",newFarmerData);
      let base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken(); 
      const response = await fetch(
        `${base_url}farmers/${aggregatorId}`, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newFarmerData)
      });
      // console.log("TEXT response from server : ==>", response);
      const data = await response.json();
      // console.log("raw response from server : ",data);
      // console.log("server resp: ",data);
      if(response.ok && data.status_code === 201) {
        return data;
      }else{
        return data;
        // throw new Error(data.error || 'Failed to create farmer');
      }
    }catch(error){
      console.error('Error creating farmer:', error);
      return null;
    }
},

  update: async (farmerId, updatedFarmerData) => {
    // console.log("data to server", updatedFarmerData.data);
    try {
        const token = await AuthTokenStore.getToken();
        let base_url = "https://platform.tdxapp.ai/api/v1/";
        const response = await fetch(`${base_url}farmers/${farmerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedFarmerData.data)
        });

        // const rawResponse = await response.text(); // Get raw response
        // console.log("Raw response from server:", rawResponse);

        const data = await response.json();

        if (response.ok && data.status_code === 200) {
            return data;
        } else {
            throw new Error(data.error || 'Failed to update farmer');
        }
    } catch (error) {
        console.error('Error updating farmer:', error);
        return null;
    }
},

  destroy: async (farmerId) => {
    try {
      const token = await AuthTokenStore.getToken();
      let base_url = "https://platform.tdxapp.ai/api/v1/";
      const response = await fetch(`${base_url}farmers/${farmerId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (response.ok && data.status_code === 200) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to delete farmer');
      }
    } catch (error) {
      console.error('Error deleting farmer:', error);
      return null;
    }
  },
};

export default FarmerController;