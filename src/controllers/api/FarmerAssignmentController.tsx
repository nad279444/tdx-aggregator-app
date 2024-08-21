import AuthTokenStore from '../../../AuthTokenStore';

const FarmerAssignmentController = {
  index: async (aggregatorId,page) => {
    try {
      let base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken(); 
      // const aggregatorId = await AuthTokenStore.getUserID();
      const response = await fetch(`${base_url}farmer-assignment/list/${aggregatorId}?page=${page}`, {
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
        throw new Error(data.message || 'Failed to fetch farmer assignments');
      }
    } catch (error) {
      console.error('Error fetching farmer assignments:', error);
      return null;
    }
  },

  show: async (assignmentId) => {
    try {
      let base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken(); 
      const response = await fetch(`${base_url}farmer-assignment/${assignmentId}`, {
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
        throw new Error(data.message || 'Failed to fetch farmer assignment');
      }
    } catch (error) {
      console.error('Error fetching farmer assignment:', error);
      return null;
    }
  },

  store: async (newAssignmentData, farmerId) => {
    try {
      let base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken(); 
      const response = await fetch(`${base_url}farmer-assignment/${farmerId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAssignmentData),
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to create farmer assignment');
      }
    } catch (error) {
      console.error('Error creating farmer assignment:', error);
      return null;
    }
  },

  update: async (assignmentId, updatedAssignmentData) => {
    try {
      let base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken(); 
      const response = await fetch(`${base_url}farmer-assignment/${assignmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAssignmentData),
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to update farmer assignment');
      }
    } catch (error) {
      console.error('Error updating farmer assignment:', error);
      return null;
    }
  },

  destroy: async (assignmentId) => {
    try {
      let base_url = "https://platform.tdxapp.ai/api/v1/";
      const token = await AuthTokenStore.getToken(); 
      const response = await fetch(`${base_url}farmer-assignment/${assignmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to delete farmer assignment');
      }
    } catch (error) {
      console.error('Error deleting farmer assignment:', error);
      return null;
    }
  },
};

export default FarmerAssignmentController;