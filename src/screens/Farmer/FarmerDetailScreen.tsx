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
import { DataContext } from "../../../DataProvider";

export default function FarmerDetailScreen({ navigation }) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idCardPhoto, setIdCardPhoto] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(true);
  const [phoneError,setPhoneError] = useState('')

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

  const saveDataToDB = () => {
    updateData('farmerName', name);
    updateData('phoneNumber', phoneNumber);
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
   
  const validatePhone = (input) => {
    const phoneRegex = /^\d{10}$/; // Exactly 10 digits
    return phoneRegex.test(input);
  };
  const handlePhoneChange = (input) => {
    setPhoneNumber(input);
    if (validatePhone(input)) {
      setPhoneError('');
    } else {
      setPhoneError('✗ Invalid phone number.');
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
      setName('');
      setPhoneNumber('');
      setIdCardPhoto(null);
    } else {
      await pickImage();
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.blackBox}>
        <View style={styles.commodityContainer}>
          <Image
            source={require("../../../assets/Maize.jpg")}
            style={styles.commodityImage}
          />
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
          <Text style={styles.inputTitle}>Name</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder="Enter Full Name"
            onChangeText={(text) => setName(text)}
            value={name}
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
      {phoneError ? <Text style={{color: 'red', marginRight: 40}}>{phoneError}</Text> : null}
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

