import { BASE_URL } from '../../constants/Constants';
import AuthTokenStore from '../../../AuthTokenStore';

const PushTokenController = {
  store: async (userID,pushToken:any) => {
    try {
      const token = await AuthTokenStore.getToken();
      const response = await fetch(`${BASE_URL}/store/push-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({user_id:userID,pushToken:pushToken})
      });
      const data = await response.json();
      
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to register push token');
      }
    } catch (error) {
      // console.error('Error registering push token:', error);
      return null;
    }
  },

//   update: async (userID,pushToken:any) => {
//     try {
//       const token = await AuthTokenStore.getToken();
//       const response = await fetch(`${BASE_URL}/update/push-token/${userID}`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({user_id:userID,pushToken:pushToken})
//       });
//       const data = await response.json();
//       if (response.ok) {
//         return data;
//       } else {
//         throw new Error(data.error || 'Failed to update push token');
//       }
//     } catch (error) {
//       console.error('Error updating push token:', error);
//       return null;
//     }
//   },

//   destroy: async (userID,pushToken:any) => {
//     try {
//       const token = await AuthTokenStore.getToken();
//       const response = await fetch(`${BASE_URL}/delete/push-token/${userID}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({user_id:userID,pushToken:pushToken})
//       });
//       const data = await response.json();
//       if (response.ok) {
//         return data;
//       } else {
//         throw new Error(data.error || 'Failed to delete token');
//       }
//     } catch (error) {
//       console.error('Error deleting push token:', error);
//       return null;
//     }
//   },
};

export default PushTokenController;