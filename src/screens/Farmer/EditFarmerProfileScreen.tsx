import React, { useState, useEffect } from 'react';
import AggregatorController from '../../controllers/api/AggregatorController';
import { StyleSheet, View, TextInput, Text, Button,ScrollView, TouchableOpacity, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import FarmerController from '../../controllers/api/FarmerContoller';
import { ActivityIndicator } from 'react-native-paper';

const EditFarmerProfileScreen = ({ route,navigation }) => {
    const [farmerData, setFarmerData] = useState(
      null
    );
    const { farmerId} = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingX, setIsLoadingX] = useState(false);
    const [error, setError] = useState(null);
    const [gender, setGender] = useState({
      gender: 'male',
      maleButtonColor: '#green',
      femaleButtonColor: '#eff',
      maleButtonTextColor: '#green',
      femaleButtonTextColor: '#eff'
  });
  
    const handleMalePress = () => {
      setGender({
          gender: 'male',
          maleButtonColor: 'green',
          femaleButtonColor: '#eff',
          maleButtonTextColor: '#fff',
          femaleButtonTextColor: 'green'
      });
      handleInputChange("gender", 'male');
  };
  
  const handleFemalePress = () => {
    setGender({
        gender: 'female',
        maleButtonColor: '#eff',
        femaleButtonColor: 'green',
        maleButtonTextColor: 'green',
        femaleButtonTextColor: '#eff'
    });
    handleInputChange("gender", 'female');
};


  useEffect(() => {
    navigation.setOptions({ title: 'Edit Farmer Profile' });
    const fetchFarmerData = async () => {
      try {
        // let storedAggregatorId = await AsyncStorage.getItem('user_id');
        const data = await FarmerController.show(farmerId);
        if (data) {
          if(data.gender== undefined){
            console.log("unset gender");
             setGender({
               gender: 'female',
               maleButtonColor: '#eff',
               femaleButtonColor: '#eff',
               maleButtonTextColor: 'green',
               femaleButtonTextColor: 'green'
           });
             
           }else if(data.gender =="male"){
             setGender({
               gender: 'male',
               maleButtonColor: '#eff',
               femaleButtonColor: 'green',
               maleButtonTextColor: 'green',
               femaleButtonTextColor: '#eff'
           });
           }else{
             setGender({
               gender: 'female',
               maleButtonColor: '#eff',
               femaleButtonColor: 'green',
               maleButtonTextColor: 'green',
               femaleButtonTextColor: '#eff'
           });
           }
          setFarmerData(data);
          setIsLoading(false);
        } else {
          setError('Failed to fetch data');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
        setIsLoading(false);
      }
    };

    fetchFarmerData();
  }, []);

// const handleInputChange = (name, value) => {
//     console.log('Input changed:', name, value);
//     setAggregatorData({ ...aggregatorData, [name]: value });
//   };


  const handleInputChange = (name, value) => {
    console.log('Input changed:', name, value);
    setFarmerData(prevState => ({
      ...prevState,
      data: {
        ...prevState.data,
        [name]: value
      }
    }));
  };

  const handleSubmit = async () => {
    setIsLoadingX(true);
    try {
    //   let storedAggregatorId = await AsyncStorage.getItem('user_id');
      const data = await FarmerController.update(farmerId, farmerData);
      console.log('response from server: data.')
      if(data.status_code==200){
        // Handle success, maybe redirect or show a success message
        // console.log("Response from server",data);
        console.log(data.message);
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
      } else {
        console.log('an error occured ',data);
        // setError('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile'+error);
    }
    setIsLoadingX(false);
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!farmerData) {
    return null; // Handle the case when aggregatorData is null
  }

  return (
    <ScrollView > 
<View style={styles.container}>

<View style={styles.labelContainer}>
{/* boxes */}
  <FontAwesome5 name="user" size={24} color="#000" style={styles.paymentIcon} />
  <Text style={styles.labelHd}>Update your Profile with valid and varifiable information  </Text>
</View>

<View style={styles.inputContainer}>
<TextInput
  style={styles.input}
  value={farmerData.data.first_name}
  onChangeText={(text) => handleInputChange('first_name', text)}
/>
</View> 
    <View style={styles.inputContainer}>
        <Text>Last Name:</Text>
        <TextInput
        style={styles.input}
        value={farmerData.data.last_name}
        onChangeText={(text) => handleInputChange('last_name', text)}
      />
    </View>

     <View style={styles.inputContainer}>
         <Text>Gender:</Text>
         <TextInput
          style={styles.input}
          value={farmerData.data.gender}
          onChangeText={(text) => handleInputChange('gender', text)}
        />
      </View>

<View style={styles.containerY}> 

<TouchableOpacity style={[styles.buttonY, { backgroundColor: gender.maleButtonColor }]}
      onPress={handleMalePress}>
      <Text style={[styles.buttonYText,{color:gender.maleButtonTextColor}]}>Male</Text>
  </TouchableOpacity>
  <TouchableOpacity
      style={[styles.buttonY, { backgroundColor: gender.femaleButtonColor }]}
      onPress={handleFemalePress}
  >
      <Text style={[styles.buttonYText,{color:gender.femaleButtonTextColor}]}>Female</Text>
  </TouchableOpacity>
</View>

<View>
{/* Selected Gender: {gender.gender} */}
<Text style={styles.selectedGenderText}></Text>

</View>
      
      <View style={styles.inputContainer}>
        <Text>Phone :</Text>
        <TextInput
          style={styles.input}
          value={farmerData.data.email}
          onChangeText={(text) => handleInputChange('email', text)}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text>Password:</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          value={farmerData.data.password}
          onChangeText={(text) => handleInputChange('password', text)}
        />
      </View>
      {/* <View style={styles.inputContainer}>
        <Text>Phone:</Text>
        <TextInput
          style={styles.input}
          value={farmerData.data.phone}
          onChangeText={(text) => handleInputChange('phone', text)}
        />
      </View> */}
      <View style={styles.inputContainer}>
        <Text>Mobile Money Number:</Text>
        <TextInput
          style={styles.input}
          value={farmerData.data.momo_pay_number}
          onChangeText={(text) => handleInputChange('momo_pay_number',text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Date of Birth:</Text>
        <TextInput
          style={styles.input}
          value={farmerData.data.date_of_birth}
          onChangeText={(text) => handleInputChange('date_of_birth',text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>ID Number:</Text>
        <TextInput
          style={styles.input}
          value={farmerData.data.id_number}
          onChangeText={(text) => handleInputChange('id_number',text)}
        />
      </View>

    
      <View style={styles.inputContainer}>
        <Text>ID Type :</Text>
        <TextInput
          style={styles.input}
          value={farmerData.data.id_type}
          onChangeText={(text) => handleInputChange('id_type',text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Account Type </Text>
        <TextInput
          style={styles.input}
          value={farmerData.data.utype}
          onChangeText={(text) => handleInputChange('utype',text)}
          editable={false}
        />
      </View>

      {isLoadingX ? (
        <ActivityIndicator size="large" color="#006400" style={styles.loadingIndicator} />
      ) : (
        <TouchableOpacity style={styles.editProfileButton} onPress={handleSubmit}>
          <Text style={styles.editProfileButtonText}>Save Changes </Text>
        </TouchableOpacity>
      )}
     
      
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerY: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  buttonY: {
      width: '47%',
      paddingVertical: 10,
      borderRadius: 20,
      alignItems: 'center',
      marginRight:15,
  },
  buttonYText: {
      fontSize: 16,
      color: 'white',
  },
  selectedGenderText: {
      marginTop: 20,
      textAlign: 'center',
      fontSize: 18,
  },
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor:"#fff",
    marginBottom:0,
    paddingBottom:30,
  },
  profileBox:{
    
    backgroundColor:"#eff",
    padding:15,
    borderRadius:10,
    marginBottom:20,
    width:"100%"
  },
  loadingIndicator: {
    marginTop: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:"#eff",
    padding:20,
    borderRadius:10,
    marginBottom:30,
  },
  headBox:{
    marginBottom:25,
    marginLeft:10,
    marginRight:10,
  },
  paymentIcon: {
    marginRight: 10,
    width:60,
    height:60,
    borderWidth: 2, // Border width
    backgroundColor:"green",
    borderColor: 'green', // Border color
    borderRadius: 50, // Half of the width and height to make it circular
    padding: 15, // Padding to ensure the icon is within the circular border
    alignContent:"center", 
    textAlign:"center", 
    color:"#fff"
  },
  labelHd: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#000', // Adjust color as needed
    marginLeft:10
  },
  editProfileButton: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    width:"100%",
    height:45,
    marginTop: 10,
  },
  editProfileButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign:"center",
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 10,
    width: '100%',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

export default EditFarmerProfileScreen;