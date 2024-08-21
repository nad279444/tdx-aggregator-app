// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, TextInput, Text, TouchableOpacity, ScrollView, Image, ToastAndroid, ActivityIndicator, RefreshControl } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { FontAwesome5 } from '@expo/vector-icons';
// import * as FileSystem from 'expo-file-system';
// import * as ImagePicker from 'expo-image-picker';
// import AggregatorController from '../../controllers/api/AggregatorController';

// const EditAggregatorProfileScreen = ({ aggregatorId }) => {
//   const [aggregatorData, setAggregatorData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoadingX, setIsLoadingX] = useState(false);
//   const [error, setError] = useState(null);
//   const [gender, setGender] = useState('male');
//   const [idCardPhoto, setIdCardPhoto] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [momoPayNumber, setMomoPayNumber] = useState('');
//   const [missingFields, setMissingFields] = useState([]);

//   useEffect(() => {
//     fetchAggregatorData();
//   }, []);

//   const fetchAggregatorData = async () => {
//     setRefreshing(true);
//     try {
//       let storedAggregatorId = await AsyncStorage.getItem('user_id');
//       const data = await AggregatorController.show(storedAggregatorId);
//       if (data) {
//         setAggregatorData(data);
//         setGender(data.gender || 'male');
//         // Set momo_pay_number if available in aggregator data
//         setMomoPayNumber(data.data.momo_pay_number || '');
//       } else {
//         setError('Failed to fetch data');
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setError('Failed to fetch data');
//     } finally {
//       setIsLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleInputChange = (name, value) => {
//     setAggregatorData(prevState => ({
//       ...prevState,
//       data: {
//         ...prevState.data,
//         [name]: value
//       }
//     }));
//   };

//   const imgTo64bit = async (photo_url) => {
//     const base64 = await FileSystem.readAsStringAsync(photo_url, { encoding: 'base64' });
//     return base64;
//   };

//   const handleCapturePhoto = async () => {
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== 'granted') {
//       alert('Sorry, we need camera permissions to make this work!');
//       return;
//     }

//     try {
//       const result = await ImagePicker.launchCameraAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 0.5,
//       });

//       if (!result.canceled && result.assets && result.assets.length > 0) {
//         const uri = result.assets[0].uri;
//         setIdCardPhoto(uri);
//       }
//     } catch (error) {
//       console.error('Error capturing image:', error);
//     }
//   };

//   const handleSubmit = async () => {
//     setIsLoadingX(true);
//     let id_card_photo ="";
//     try {
//       if(idCardPhoto){
//         id_card_photo = await imgTo64bit(idCardPhoto);
//         }
//       let storedAggregatorId = await AsyncStorage.getItem('user_id');
//       aggregatorData.gender = gender;
//       // Ensure momo_pay_number is set in aggregatorData
//       aggregatorData.data.momo_pay_number = momoPayNumber;
      
//       // console.log("data to server >>>>> ", aggregatorData);
      
//       const data = await AggregatorController.update(storedAggregatorId, aggregatorData);
//       if (data.status_code === 200) {
//         ToastAndroid.show('Aggregator profile updated successfully!', ToastAndroid.SHORT);
//       } else {
//         ToastAndroid.show('Failed to update profile', ToastAndroid.SHORT);
//         // console.log(data.missing_fields);
//         // setMissingFields(data.missing_fields);
//       }
//     } catch (error) {
//       ToastAndroid.show('Failed to update profile', ToastAndroid.SHORT);
//       console.error('Error updating profile:', error);
//       setMissingFields(error.missing_fields);
//     }
//     setIsLoadingX(false);
//   };

//   const onRefresh = () => {
//     fetchAggregatorData();
//   };

//   if (isLoading) {
//     return <ActivityIndicator size="large" color="#3498db" />;
//   }

//   if (error) {
//     return <Text>Error: {error}</Text>;
//   }

//   if (!aggregatorData) {
//     return null;
//   }

//   return (
//     <ScrollView
//       style={styles.container}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }
//     >
//       <View style={styles.labelContainer}>
//          <FontAwesome5 name="user" size={20} color="#fff" style={styles.paymentIcon} />
//          <Text style={styles.labelHd}>Update your Profile with valid and verifiable information</Text>
//       </View>

//       <View style={styles.inputContainer}>
//         <Text>First Name:</Text>
//         <TextInput
//           style={styles.input}
//           value={aggregatorData.data.first_name}
//           onChangeText={(text) => handleInputChange('first_name', text)}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Text>Last Name:</Text>
//         <TextInput
//           style={styles.input}
//           value={aggregatorData.data.last_name}
//           onChangeText={(text) => handleInputChange('last_name', text)}
//         />
//       </View>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={[styles.genderButton, gender === 'male' && styles.selectedGenderButton]}
//           onPress={() => setGender('male')}
//         >
//           <Text style={[styles.genderButtonText, gender === 'male' && styles.selectedGenderButtonText]}>Male</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.genderButton, gender === 'female' && styles.selectedGenderButton]}
//           onPress={() => setGender('female')}
//         >
//           <Text style={[styles.genderButtonText, gender === 'female' && styles.selectedGenderButtonText]}>Female</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.inputContainer}>
//         <Text>Email:</Text>
//         <TextInput
//           style={styles.input}
//           value={aggregatorData.data.email}
//           onChangeText={(text) => handleInputChange('email', text)}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Text>Password:</Text>
//         <TextInput
//           style={styles.input}
//           secureTextEntry={true}
//           value={aggregatorData.data.password}
//           onChangeText={(text) => handleInputChange('password', text)}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Text>Phone:</Text>
//         <TextInput
//           style={styles.input}
//           value={aggregatorData.data.phone}
//           onChangeText={(text) => handleInputChange('phone', text)}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Text>Alternative Phone:</Text>
//         <TextInput
//           style={styles.input}
//           value={aggregatorData.data.alt_phone}
//           onChangeText={(text) => handleInputChange('alt_phone', text)}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Text>Date of Birth:</Text>
//         <TextInput
//           style={styles.input}
//           value={aggregatorData.data.date_of_birth}
//           onChangeText={(text) => handleInputChange('date_of_birth', text)}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Text>ID Number:</Text>
//         <TextInput
//           style={styles.input}
//           value={aggregatorData.data.id_number}
//           onChangeText={(text) => handleInputChange('id_number', text)}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Text>ID Type:</Text>
//         <TextInput
//           style={styles.input}
//           value={aggregatorData.data.id_type}
//           onChangeText={(text) => handleInputChange('id_type', text)}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Text>Account Type:</Text>
//         <TextInput
//           style={styles.input}
//           value={aggregatorData.data.utype}
//           onChangeText={(text) => handleInputChange('utype', text)}
//           editable={false}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Text>Mobile Money Number:</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your mobile money number"
//           value={momoPayNumber}
//           onChangeText={(text) => setMomoPayNumber(text)}
//           keyboardType="phone-pad"
//           autoCapitalize="none"
//         />
//       </View>

//       {/* ID Card Photo Section */}
//       <View style={styles.inputContainer}>
//         <Text>ID Card Photo</Text>
//         {!idCardPhoto && (
//           <TouchableOpacity style={styles.cameraButton} onPress={handleCapturePhoto}>
//             <Text style={styles.cameraButtonText}>Capture ID Card Photo</Text>
//           </TouchableOpacity>
//         )}

//         {idCardPhoto && (
//           <TouchableOpacity onPress={handleCapturePhoto}>
//             <Image source={{ uri: idCardPhoto }} style={styles.capturedImage} />
//           </TouchableOpacity>
//         )}
//       </View>

//       {missingFields.length > 0 && (
//         <View style={{ marginBottom: 10 }}>
//           {missingFields.map((field, index) => (
//             <Text key={index} style={{ color: 'red', textTransform: 'capitalize' }}>
//               {field} field is required.
//             </Text>
//           ))}
//         </View>
//       )}

//       {/* Save Changes Button */}
//       <TouchableOpacity
//         style={styles.saveButton}
//         onPress={handleSubmit}
//         disabled={isLoadingX}
//       >
//         {isLoadingX ? (
//           <ActivityIndicator color="#fff" size="small" />
//         ) : (
//           <Text style={styles.saveButtonText}>Save Changes</Text>
//         )}
//       </TouchableOpacity>
//       <View style={{marginBottom:30}}>

//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: 20,
//     paddingVertical: 30,
    
//   },
//   labelContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#eff',
//     padding: 20,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   paymentIcon: {
//     marginRight: 10,
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     padding: 15,
//     alignItems:'center',
//     alignContent:'center',
//     textAlign:'center',
//     backgroundColor: 'green',
//   },
//   labelHd: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   input: {
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   genderButton: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     backgroundColor: '#eee',
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: '#eee',
//     marginRight:5
//   },
//   selectedGenderButton: {
//     backgroundColor: 'green',
//   },
//   genderButtonText: {
//     color: 'green',
//   },
//   selectedGenderButtonText: {
//     color: '#fff',
//   },
//   cameraButton: {
//     backgroundColor: '#eff',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   cameraButtonText: {
//     color: 'green',
//     fontSize: 16,
//   },
//   capturedImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   saveButton: {
//     backgroundColor: 'green',
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });


// export default EditAggregatorProfileScreen;




import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ScrollView, Image, ToastAndroid, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import AggregatorController from '../../controllers/api/AggregatorController';

const EditAggregatorProfileScreen = ({ aggregatorId }) => {
  const [aggregatorData, setAggregatorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingX, setIsLoadingX] = useState(false);
  const [error, setError] = useState(null);
  const [gender, setGender] = useState('male');
  const [idCardPhoto, setIdCardPhoto] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [momoPayNumber, setMomoPayNumber] = useState('');
  const [missingFields, setMissingFields] = useState([]);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [idType, setIdType] = useState('');

  useEffect(() => {
    fetchAggregatorData();
  }, []);

  const fetchAggregatorData = async () => {
    setRefreshing(true);
    try {
      let storedAggregatorId = await AsyncStorage.getItem('user_id');
      const data = await AggregatorController.show(storedAggregatorId);
      if (data) {
        console.log(data);
        setAggregatorData(data);
        setGender(data.gender || 'male');
        setMomoPayNumber(data.data.momo_pay_number || '');
        setDateOfBirth(new Date(data.data.date_of_birth) || new Date());
        setIdType(data.data.id_type || '');
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleInputChange = (name, value) => {
    setAggregatorData(prevState => ({
      ...prevState,
      data: {
        ...prevState.data,
        [name]: value
      }
    }));
  };

  const imgTo64bit = async (photo_url) => {
    const base64 = await FileSystem.readAsStringAsync(photo_url, { encoding: 'base64' });
    return base64;
  };

  const handleCapturePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setIdCardPhoto(uri);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
    handleInputChange('date_of_birth', currentDate.toISOString().split('T')[0]);
  };

  const handleSubmit = async () => {
    setIsLoadingX(true);
    let id_card_photo = "";
    try {
      if (idCardPhoto) {
        id_card_photo = await imgTo64bit(idCardPhoto);
        aggregatorData.data.id_card_photo = id_card_photo;
      }
      let storedAggregatorId = await AsyncStorage.getItem('user_id');
      aggregatorData.gender = gender;
      aggregatorData.data.momo_pay_number = momoPayNumber;
      aggregatorData.data.id_type = idType;
      
      console.log("data to server >>>",aggregatorData);

      const data = await AggregatorController.update(storedAggregatorId, aggregatorData);
      if (data.status_code === 200) {
        ToastAndroid.show('Aggregator profile updated successfully!', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Failed to update profile', ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Failed to update profile', ToastAndroid.SHORT);
      console.error('Error updating profile:', error);
      setMissingFields(error.missing_fields);
    }
    setIsLoadingX(false);
  };

  const onRefresh = () => {
    fetchAggregatorData();
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#3498db" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!aggregatorData) {
    return null;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.labelContainer}>
        <FontAwesome5 name="user" size={20} color="#fff" style={styles.paymentIcon} />
        <Text style={styles.labelHd}>Update your Profile with valid and verifiable information</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text>First Name:</Text>
        <TextInput
          style={styles.input}
          value={aggregatorData.data.first_name}
          onChangeText={(text) => handleInputChange('first_name', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Last Name:</Text>
        <TextInput
          style={styles.input}
          value={aggregatorData.data.last_name}
          onChangeText={(text) => handleInputChange('last_name', text)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'male' && styles.selectedGenderButton]}
          onPress={() => setGender('male')}
        >
          <Text style={[styles.genderButtonText, gender === 'male' && styles.selectedGenderButtonText]}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'female' && styles.selectedGenderButton]}
          onPress={() => setGender('female')}
        >
          <Text style={[styles.genderButtonText, gender === 'female' && styles.selectedGenderButtonText]}>Female</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text>Email or Phone Number:</Text>
        <TextInput
          style={styles.input}
          value={aggregatorData.data.email}
          onChangeText={(text) => handleInputChange('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* <View style={styles.inputContainer}>
        <Text>Password:</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          value={aggregatorData.data.password}
          onChangeText={(text) => handleInputChange('password', text)}
        />
      </View> */}

      <View style={styles.inputContainer}>
        <Text>Phone:</Text>
        <TextInput
          style={styles.input}
          value={aggregatorData.data.phone}
          onChangeText={(text) => handleInputChange('phone', text)}
          keyboardType="phone-pad"
          placeholder="233-XXX-XXXX"
        />
      </View>

      {/* <View style={styles.inputContainer}>
        <Text>Alternative Phone:</Text>
        <TextInput
          style={styles.input}
          value={aggregatorData.data.alt_phone}
          onChangeText={(text) => handleInputChange('alt_phone', text)}
          keyboardType="phone-pad"
          placeholder="233-XXX-XXXX"
        />
      </View> */}

      <View style={styles.inputContainer}>
        <Text>Date of Birth:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text>{dateOfBirth.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dateOfBirth}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text>ID Number:</Text>
        <TextInput
          style={styles.input}
          value={aggregatorData.data.id_number}
          onChangeText={(text) => handleInputChange('id_number', text)}
          placeholder="GH-XXXXX-"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>ID Type:</Text>
        <Picker
          selectedValue={idType}
          onValueChange={(itemValue) => setIdType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select ID Type" value="" />
          <Picker.Item label="Voter" value="voter" />
          <Picker.Item label="Passport" value="passport" />
          <Picker.Item label="NHIS" value="nhis" />
          <Picker.Item label="National ID" value="national_id" />
          <Picker.Item label="Driving License" value="driving_license" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text>Momopay Number:</Text>
        <TextInput
          style={styles.input}
          value={momoPayNumber}
          onChangeText={text => setMomoPayNumber(text)}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>ID Card Photo:</Text>
        <TouchableOpacity onPress={handleCapturePhoto} style={styles.captureButton}>
          <Text style={styles.captureButtonText}>Capture ID Card</Text>
        </TouchableOpacity>
        {aggregatorData.data.id_card_photo && (
        <Image
        style={{ width: 360, height: 300,borderRadius:10 }} // Adjust width and height as needed
        source={{ uri: `data:image/png;base64,${aggregatorData.data.id_card_photo}` }}
        />)}
        
      </View>

      {missingFields.length > 0 && (
        <View style={styles.missingFieldsContainer}>
          <Text style={styles.missingFieldsHeader}>Missing Fields:</Text>
          {missingFields.map((field, index) => (
            <Text key={index} style={styles.missingField}>{field}</Text>
          ))}
        </View>
      )}

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        {isLoadingX ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Save</Text>
        )}
      </TouchableOpacity>
      <View style={{height:40}}>

      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 30,
    
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  paymentIcon: {
    marginRight: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 15,
    alignItems:'center',
    alignContent:'center',
    textAlign:'center',
    backgroundColor: 'green',
  },
  labelHd: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  genderButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#eee',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
    marginRight:5
  },
  selectedGenderButton: {
    backgroundColor: 'green',
  },
  genderButtonText: {
    color: 'green',
  },
  selectedGenderButtonText: {
    color: '#fff',
  },
  cameraButton: {
    backgroundColor: '#eff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  cameraButtonText: {
    color: 'green',
    fontSize: 16,
  },
  capturedImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: 'green',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },





  
  capturedPhoto: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
    
  },
  captureButton: {
    borderWidth: 1,
    borderColor: '#eff',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor:"#eff",
    color:'green',
    // height:50
    marginBottom:12
  },
  captureButtonText: {
    color: 'green',
  },
  submitButton: {
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom:32
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  missingFieldsContainer: {
    backgroundColor: '#f8d7da',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  missingFieldsHeader: {
    color: '#721c24',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  missingField: {
    color: '#721c24',
  },
  
  picker: {
    // height: 50,
    width: '100%',
    borderWidth: 0,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 5,
    backgroundColor:"#eff",
    color:'green'
  },
});



export default EditAggregatorProfileScreen;
