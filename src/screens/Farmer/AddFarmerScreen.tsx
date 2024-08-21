import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator } from 'react-native-paper';
import { CheckBox } from 'react-native-elements';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';

import FarmerController from '../../controllers/api/FarmerContoller'; // Adjust path as per your actual structure
import AuthTokenStore from '../../../AuthTokenStore'; // Adjust path as per your actual structure

const AddFarmerScreen = ({ navigation }) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [idCardPhoto, setIdCardPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [community, setCommunity] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [missingFields, setMissingFields] = useState<string[]>([]); // Specify the type of array elements

  const imgToBase64 = async (photoUrl) => {
    if (photoUrl) {
      const base64 = await FileSystem.readAsStringAsync(photoUrl, { encoding: 'base64' });
      return base64;
    }
    return null;
  };

  useEffect(() => {
    navigation.setOptions({ title: 'Add New Farmer' });
  }, []);

  const validateEmailOrPhone = (input) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?[0-9]{10,13}$/;
    return emailPattern.test(input) || phonePattern.test(input);
  };

  const handleRegistration = async () => {
    if (!validateEmailOrPhone(emailOrPhone)) {
      setError("Please enter a valid email or phone number.");
      return;
    }

    let idCardBase64 = null;
    try {
      setLoading(true);
      if (idCardPhoto) {
        idCardBase64 = await imgToBase64(idCardPhoto);
      }
      const farmerData = {
        first_name: firstName,
        community: community,
        last_name: lastName,
        utype: "FARMER",
        phone: validateEmailOrPhone(emailOrPhone) ? emailOrPhone : emailOrPhone,
        email: validateEmailOrPhone(emailOrPhone) ? emailOrPhone : emailOrPhone,
        gender: gender,
        id_card_photo: idCardBase64
      };
      const aggregatorID =await AuthTokenStore.getUserID();
      const result = await FarmerController.store(farmerData,aggregatorID);
      if (result.status_code === 201) {
        ToastAndroid.showWithGravity(result.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
        navigation.navigate('ManageFarmersScreen');
      } else {
        console.log(result.missing_fields);
        setMissingFields(result.missing_fields);
        ToastAndroid.showWithGravity(result.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
      }
    } catch (error) {
      setError(error.message); // Update to capture error messages correctly
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
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

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>New Farmer Details</Text>
        <Text style={styles.label}>Add a new farmer to your community</Text>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <Text style={styles.label}>E-mail or Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail or Phone Number"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
        />
        {!validateEmailOrPhone(emailOrPhone) && emailOrPhone !== '' && (
          <Text style={styles.errorText}>Please enter a valid email address or phone number.</Text>
        )}
        <Text style={styles.label}>Community</Text>
        <TextInput
          style={styles.input}
          placeholder="Community"
          value={community}
          onChangeText={setCommunity}
        />

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Capture ID Card Photo</Text>
        </TouchableOpacity>
        {idCardPhoto && <Image source={{ uri: idCardPhoto }} style={styles.idCardPhoto} />}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.checkboxContainer}>
          <CheckBox
            title="I agree to the terms and conditions"
            checked={agreeTerms}
            onPress={() => setAgreeTerms(!agreeTerms)}
          />
        </View>
        {missingFields&&(
        <>
          {missingFields.length > 0 && (
            <View style={{ marginBottom: 10 }}>
              {missingFields.map((field, index) => (
              <Text key={index} style={{ color: 'red', textTransform: 'capitalize' }}>
                {field} field is required.
              </Text>
            ))}
          </View>
        )}
        </>
      )}
        <TouchableOpacity style={styles.button} onPress={handleRegistration} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginTop: 50,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  button: {
    width: '100%',
    marginBottom: 10,
    paddingVertical: 12,
    backgroundColor: '#006400',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  idCardPhoto: {
    width: "100%",
    height: 250,
    marginBottom: 10,
    borderRadius: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default AddFarmerScreen;
