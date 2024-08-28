import React, { useState, useEffect,useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity,Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons"
import { DataContext } from '../../../DataProvider';

const AddFarmerScreen = ({ route,navigation }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const {imageUri} = route.params

  const {addFarmer} = useContext(DataContext)

  useEffect(() => {
    navigation.setOptions({
      title: "Farmers",
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

  const validatePhone = (input) => {
    const phonePattern = /^\+?[0-9]{10,13}$/;
    return phonePattern.test(input);
  };

  const handleFarmer =  async() => {
   await addFarmer(name,phoneNumber,imageUri)
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
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
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>Phone Number</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder="Enter Your Phone Number"
            onChangeText={(text) => setPhoneNumber(text)}
            keyboardType="numeric"
            value={phoneNumber}
          />
        </View>
      </View>
      {imageUri && (
        <View style={styles.imagePreviewContainer}>
          <Image
            source={{ uri: imageUri}}
            style={styles.imagePreview}
          />
        </View>
      )}
      <TouchableOpacity
        style={name && phoneNumber ? styles.greenButton : styles.disabledButton}
        onPress={handleFarmer}
        disabled={!name || !phoneNumber}
      >
        <Text style={{ fontSize: 18, color: "white" }}>
          Add farmer
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    marginLeft: 10,
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
    marginHorizontal: 10,
    textAlign: "right",
    backgroundColor: "#FFFFFF",
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
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
});

export default AddFarmerScreen;
