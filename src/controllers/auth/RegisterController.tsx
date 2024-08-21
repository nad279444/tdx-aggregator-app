import { BASE_URL } from '../../constants/Constants';
const RegisterController = async(first_name: any,last_name: any,phone: any,momo_pay_number:any,gender: any,email: any,password: any,id_card_photo: any) => {
    try{
    console.log("gender again: >>>>>>>>>>>  ",gender);
    // console.log("User Type again: <<<<<<<<<<  ",utype);
    const utype = "AGGREGATOR";
    let data_sent ={first_name,last_name,phone,momo_pay_number,utype,gender,email,password,id_card_photo };
    console.log("ALL DATA TO SERVER: >>>>>>>>>>>",data_sent)
    const response = await fetch(`${BASE_URL}/aggregators`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data_sent),
    });
    const data = await response.json();
    // const data = await response.text();
    // console.log(data);
    // console.log("message:"+data.message);
      if(data.status_code!==200) {
        return data;
        // return { success: false, status_code:data.status_code, message:data.message, error:data.message };
      }
    return {success: true,accessToken: data.accessToken,status_code:data.status_code, message:data.message };
  } catch (error) {
    // console.error('Error during Registration:', error);
    return { success: false, message: error };
  }
};
export default RegisterController;