import { BASE_URL } from '../../constants/Constants';
import AuthTokenStore from '../../../AuthTokenStore';

const NotificationController = {
    
  index: async (page: number) => {
    try {
    //   const base_url = 'https://platform.tdxapp.ai/api/v1';
      const token = await AuthTokenStore.getToken();
      const response = await fetch(`${BASE_URL}/notifications/list?page=${page}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      // console.log("data from server ::: ",data);
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return null;
    }
  },

  show: async (id: string) => {
    try {
      const token = await AuthTokenStore.getToken();
      const response = await fetch(`${BASE_URL}/notifications/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to fetch notification');
      }
    } catch (error) {
      console.error('Error fetching notification:', error);
      return null;
    }
  },

  store: async (newNotificationData: any) => {
    try {
      const token = await AuthTokenStore.getToken();
      const response = await fetch(`${BASE_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newNotificationData)
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to create notification');
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  },

  update: async (id: string, updatedNotificationData: any) => {
    try {
      const token = await AuthTokenStore.getToken();
      const response = await fetch(`${BASE_URL}/notifications/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedNotificationData)
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to update notification');
      }
    } catch (error) {
      console.error('Error updating notification:', error);
      return null;
    }
  },

  destroy: async (id: string) => {
    try {
      const token = await AuthTokenStore.getToken();
      const response = await fetch(`${BASE_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      return null;
    }
  },
};

export default NotificationController;