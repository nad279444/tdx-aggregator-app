import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CommodityController from '../../controllers/api/CommodityController';
import AuthTokenStore from '../../../AuthTokenStore';
import { ActivityIndicator } from 'react-native-paper';
import { CheckBox } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';

const AddCommodityScreen = ({ navigation }) => {
  const [batchNo, setBatchNo] = useState('');
  const [name, setName] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitType, setUnitType] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [grade, setGrade] = useState('');
  const [source, setSource] = useState('');
  const [sourceRegion, setSourceRegion] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [currentRegion, setCurrentRegion] = useState('');
  const [commodityImage, setCommodityImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: 'Add a New Commodity' });
  }, []);

  const handleRegistration = async () => {
    try {
      setLoading(true);
      // Prepare commodity data
    //   let aggregator_id = await AuthTokenStore.getUserID();
     // Get aggregator ID
     let aggregatorId = await AuthTokenStore.getUserID();

      let commodityData = {
        batch_no: batchNo,
        name: name,
        cost_price: costPrice,
        selling_price: sellingPrice,
        quantity: quantity,
        unit_type: unitType,
        vendor_id: aggregatorId,
        grade: grade,
        source: source,
        source_region: sourceRegion,
        current_location: "others", //currentLocation,
        current_region: currentRegion,
        // commodity_image: commodityImage
      };

      console.log(commodityData);

      // Call CommodityController to store the data
      const result = await CommodityController.store(commodityData,aggregatorId);

      // Handle response
      if (result.status_code == 200) {
        ToastAndroid.showWithGravity(result.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
        navigation.navigate('ManageCommodityScreen');
      } else {
        ToastAndroid.showWithGravity(result.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    // Add code to handle capturing image
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>New Commodity Details </Text>
        <Text style={styles.label}>Add a new Farmer to the Community </Text>
        <TextInput
          style={styles.input}
          placeholder="Batch Number"
          value={batchNo}
          onChangeText={setBatchNo}
        />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Cost Price"
          value={costPrice}
          onChangeText={setCostPrice}
        />
        <TextInput
          style={styles.input}
          placeholder="Selling Price"
          value={sellingPrice}
          onChangeText={setSellingPrice}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
        />
        <TextInput
          style={styles.input}
          placeholder="Unit Type"
          value={unitType}
          onChangeText={setUnitType}
        />
        <TextInput
          style={styles.input}
          placeholder="Vendor ID"
          value={vendorId}
          onChangeText={setVendorId}
        />
        <TextInput
          style={styles.input}
          placeholder="Grade"
          value={grade}
          onChangeText={setGrade}
        />
        <TextInput
          style={styles.input}
          placeholder="Source"
          value={source}
          onChangeText={setSource}
        />
        <TextInput
          style={styles.input}
          placeholder="Source Region"
          value={sourceRegion}
          onChangeText={setSourceRegion}
        />
        <TextInput
          style={styles.input}
          placeholder="Current Location"
          value={currentLocation}
          onChangeText={setCurrentLocation}
        />
        <TextInput
          style={styles.input}
          placeholder="Current Region"
          value={currentRegion}
          onChangeText={setCurrentRegion}
        />
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Capture Commodity Image</Text>
        </TouchableOpacity>
        {commodityImage && <Image source={{ uri: commodityImage }} style={styles.commodityImage} />}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.checkboxContainer}>
          <CheckBox
            title="I agree to the terms and conditions"
            checked={agreeTerms}
            onPress={() => setAgreeTerms(!agreeTerms)}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegistration} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}> Submit </Text>
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
  commodityImage: {
    width: '100%',
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

export default AddCommodityScreen;