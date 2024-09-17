import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { DataContext } from "../../../DBContext";
import { farmers } from "../../controllers/api/farmerList";

export default function FarmerDetailScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [farmerToken,setFarmerToken] = useState('')
  const [communityId,setCommunityId] =useState('')
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idCardPhoto, setIdCardPhoto] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [phoneError,setPhoneError] = useState('')
  const [nameError, setNameError] = useState('');
  const [firstName,setFirstName] = useState('')
  const [lastName,setlastName] = useState('')

  const { data, updateData } = useContext(DataContext);
  
  useEffect(() => {
    navigation.setOptions({
      title: "Sell Direct",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const verifyFarmer = async() => {
      const {mobile,token,community_id} = await farmers.getOne(phoneNumber)
      if(mobile == phoneNumber){
        setIsVerified(true)
      }else{
        setIsVerified(false)
      }
      setCommunityId(community_id)
      setFarmerToken(token)
    }
    verifyFarmer()
  },[phoneNumber])

  const saveDataToDB = () => {
      updateData('farmerName', fullName);
      updateData('phoneNumber', phoneNumber);
      updateData('farmerToken', farmerToken);
      updateData('communityId', communityId);
      updateData('idCardPhoto', idCardPhoto);
  };
  
  // const imgToBase64 = async (photoUrl) => {
  //   if (photoUrl) {
  //     try {
  //       const base64 = await FileSystem.readAsStringAsync(photoUrl, { encoding: 'base64' });
  //       return base64;
  //     } catch (error) {
  //       console.error('Error converting image to base64:', error);
  //       return null;
  //     }
  //   }
  //   return null;
  // };

  const validateFullName = (input) => {
    const nameParts = input.trim().split(" ");
    if (nameParts.length >= 2){
      const lastName =  nameParts.pop()
      const firstName = nameParts.join(' ')
      setFirstName(firstName)
      setlastName(lastName)
      return `${firstName} ${lastName}`
    }else{
      setNameError('✗ Please enter both first and last name.');
    }
  };
  const handleFullNameChange = (input) => {
    setFullName(input);
    if (validateFullName(input)) {
      setNameError('');
    } else {
      setNameError('✗ Please enter both first and last name.');
    }
  };
 

  const validatePhone = (input) => {
    const phoneRegex = /^\d{10}$/; // Exactly 10 digits
    return phoneRegex.test(input);
  };
  const handlePhoneChange = (input) => {
    setPhoneNumber(input);
    if (validatePhone(input)) {
      setPhoneError('');
    } else {
      setPhoneError('✗ Invalid number.');
    }
  };
  const pickImage = async () => {
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

        
       

      
  
      } else {
        console.log("ImagePicker was canceled or returned no assets");
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  const handleNext = async () => {
    if (idCardPhoto) {
      saveDataToDB();
      navigation.navigate('QualityControlScreen');
      setFullName('');
      setPhoneNumber('');
      setCommunityId('')
      setIdCardPhoto(null);
    } else {
      await pickImage();
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.blackBox}>
        <View style={styles.commodityContainer}>

          <View style={{ marginLeft: 20 }}>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
              {data.commodity}
            </Text>
            <Text style={{ color: "#94E081", fontSize: 14, fontWeight: "500" }}>
              {data.bags} bags, {data.weight} KG
            </Text>
          </View>
        </View>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
          {data.totalPrice} ₵
        </Text>
      </View>
      <View style={{ marginLeft: 20, marginTop: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Enter Farmer Details
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>Full Name</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder="Enter Full Name"
            onChangeText={handleFullNameChange}
            value={fullName}
          />
          {isVerified && (
            <Ionicons
              name="checkmark-outline"
              size={20}
              color="#21893E"
              style={styles.checked}
            />
          )}
        </View>
      </View>
      {nameError ? <Text style={{ color: 'red', marginLeft: 20 }}>{nameError}</Text> : null}
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>Phone Number</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder="Enter Your Phone Number"
            onChangeText={handlePhoneChange}
            keyboardType="numeric"
            value={phoneNumber}
          />
          {isVerified && (
            <Ionicons
              name="checkmark-outline"
              size={20}
              color="#21893E"
              style={styles.checked}
            />
          )}
        </View>

      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: 10,
          marginRight: 20,
        }}
      >  
      {phoneError ? <Text style={{color: 'red', marginRight: 60}}>{phoneError}</Text> : null}
        {isVerified ? (
          <Text style={{ color: "green" }}>Farmer details verified</Text>
        ) : (
          <Text style={{ color: "red" }}>Farmer could not be found</Text>
        )}
      </View>
      
      {idCardPhoto && (
        <View style={styles.imagePreviewContainer}>
          <Image
            source={{ uri: idCardPhoto }}
            style={styles.imagePreview}
          />
        </View>
      )}
      <TouchableOpacity
        style={isVerified ? styles.greenButton : styles.disabledButton}
        onPress={handleNext}
        disabled={!isVerified}
      >
        <Text style={{ fontSize: 18, color: "white" }}>
          {idCardPhoto ? "Confirm and Continue" : "ID Card Image"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  blackBox: {
    height: 120,
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 50,
  },
  commodityContainer: {
    flexDirection: "row",
  },
  commodityImage: {
    marginLeft: 20,
    marginTop: 5,
    width: 35,
    height: 40,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom:5,
  },
  inputGroup: {
    flex: 1,
    position: "relative",
  },
  inputTitle: {
    marginLeft: 20,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  nameInput: {
    height: 60,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 4,
    padding: 10,
    marginHorizontal: 20,
    textAlign: "right",
    backgroundColor: "#FFFFFF",
  },
  checked: {
    position: "absolute",
    right: 35,
    bottom: 15,
  },
  greenButton: {
    backgroundColor: "#21893E",
    marginTop: 30,
    height: 50,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: "center",
  },
  disabledButton: {
    marginTop: 30,
    height: 50,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    backgroundColor: "#D5D8DE",
    alignItems: "center",
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});

