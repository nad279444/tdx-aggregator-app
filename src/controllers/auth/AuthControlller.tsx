// import { BASE_URL } from '../../constants/Constants';
const BASE_URL = "https://platform.tdxapp.ai/api/v1";
const AuthController = {
  forgotPassword: async (email) => {
    try {
      console.log(email);
      const response = await fetch(`${BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      // let x = await response.text();
      // console.log("RRRESP::::",x);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching:', error);
      return null;
    }
  },

  resetPassword: async (passwordData) => {
    try {
      const response = await fetch(`${BASE_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching:', error);
      return null;
    }
  },

  forgotPasswordWithEmail: async (email) => {
    try {
      const response = await fetch(`${BASE_URL}/password/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching:', error);
      return null;
    }
  },

  codeCheck: async (codeData) => {
    try {
      const response = await fetch(`${BASE_URL}/password/code/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(codeData)
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching:', error);
      return null;
    }
  },

  resetPasswordWithEmail: async (passwordData) => {
    try {
      const base_url = BASE_URL;
      const response = await fetch(`${BASE_URL}/password/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching:', error);
      return null;
    }
  }
};

export default AuthController;
