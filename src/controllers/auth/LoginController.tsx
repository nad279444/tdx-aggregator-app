import { BASE_URL } from '../../constants/Constants';
const LoginController = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
           'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log(data.status_code);
    console.log(data);
      if(data.status_code!==200) {
        return { success: false, message: data.message};
      }
      // ,user:JSON.stringify(data.user),
    return {success: true,accessToken: data.accessToken,message: data.message,udata:data,user_id:data.user_id };
  } catch (error) {
    console.error('Error during login:', error);
    return { success: false, message: 'An error occurred during login.' };
  }
};
export default LoginController;