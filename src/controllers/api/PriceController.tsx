import { BASE_URL } from '../../constants/Constants';
import AuthTokenStore from '../../../AuthTokenStore';

const PriceController = {
  index: async (commodity_id: string, page: number) => {
    try {
        console.log(commodity_id);
      const base_url = "https://platform.tdxapp.ai/api/v1";
      const token = await AuthTokenStore.getToken();
      const response = await fetch(`${base_url}/community-prices/list/${commodity_id}?page=${page}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
    //   console.log("resp:::",data);
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to fetch prices');
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
      return null;
    }
  },

  show: async (id: number) => {
    try {
      const token = await AuthTokenStore.getToken();
      const base_url = "https://platform.tdxapp.ai/api/v1";
      const response = await fetch(`${base_url}/community-price/item/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to fetch price');
      }
    } catch (error) {
      console.error('Error fetching price:', error);
      return null;
    }
  },

  store: async (commodity_id: string, newPriceData) => {
    try {
      const token = await AuthTokenStore.getToken();
      const base_url = "https://platform.tdxapp.ai/api/v1";
      const response = await fetch(`${base_url}/community-prices/${commodity_id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPriceData),
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to create price');
      }
    } catch (error) {
      console.error('Error creating price:', error);
      return null;
    }
  },

  update: async (id: number, updatedPriceData) => {
    try {
      const token = await AuthTokenStore.getToken();
      const base_url = "https://platform.tdxapp.ai/api/v1";
      const response = await fetch(`${base_url}/community-prices/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPriceData),
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to update price');
      }
    } catch (error) {
      console.error('Error updating price:', error);
      return null;
    }
  },

  destroy: async (id: number) => {
    try {
      const token = await AuthTokenStore.getToken();
      const base_url = "https://platform.tdxapp.ai/api/v1";
      const response = await fetch(`${base_url}/community-prices/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        return null;
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete price');
      }
    } catch (error) {
      console.error('Error deleting price:', error);
      return null;
    }
  },
};

export default PriceController;
