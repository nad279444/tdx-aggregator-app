import React, { useEffect, useState } from 'react';
import { View, Text,Image,TouchableOpacity,ScrollView, Button, StyleSheet } from 'react-native';
import AggregatorController from '../../controllers/api/AggregatorController';
// import {  } from 'react-native-gesture-handler';
import { Divider } from 'react-native-elements';
import AuthTokenStore from '../../../AuthTokenStore';
import FarmerController from '../../controllers/api/FarmerContoller';

const FarmerProfileScreen = ({ route, navigation }) => {
  const [farmer, setFarmer] = useState(null);
  const {farmerData,commodityData,assignmentId } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: 'Farmer Profile' });
    // const farmerId = AuthTokenStore.getUserID();
    fetchFarmerProfile(farmerData.id);
  }, []);

  const fetchFarmerProfile = async (id) => {
    try {
      const response = await FarmerController.show(id);
      if (response) {
        setFarmer(response.data);
      }
    } catch(error){
      console.error('Error fetching aggregator profile:', error);
    }
  };

  if(!farmer) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView> 
    <View style={styles.container}>
    <View style={styles.coverPhoto}>
        {/* Cover Photo Image */}
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.profilePictureContainer}>
          {/* Profile Picture Image */}
        </View>
        <Divider style={{marginTop:10,marginBottom:5}} />
        <View> 
        <Text style={styles.userName}>{farmer.first_name} {farmer.last_name}</Text>
        <Text style={styles.userInfo}>{farmer.email||farmer.phone}</Text>
        
        </View>

        <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
        <TouchableOpacity style={styles.editProfileButton} onPress={() => navigation.navigate('EditFarmerProfileScreen',{farmerId:farmer.id})}>
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.infoItem}>
        <TouchableOpacity style={styles.sellBTN} onPress={() =>navigation.push('CommodityListScreen',{farmerId:farmer.id})}>
          <Text style={styles.sellBTNText}>Sell to TDX </Text>
        </TouchableOpacity>
        </View>

        </View>

      </View>
      <Divider style={{marginTop:30,marginBottom:0}} />
      {(farmer.bio)? 
      <>
      <View style={styles.bioContainer}>
        <Text style={styles.bioText}>
         {farmer.bio} 
        </Text>
      </View>
      </>
      : <></>}
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoNumber}>{farmer.no_of_trade}  </Text>
          <Text style={styles.infoText}>No of Transactions </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoNumber}>{farmer.approval_rating} </Text>
          <Text style={styles.infoText}>Approval Ratings </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoNumber}>{farmer.completed} </Text>
          <Text style={styles.infoText}>Completed </Text>
        </View>
      </View>
      <Divider ></Divider>
      <View style={styles.profileField}>
        <Text style={[styles.fieldLabel, styles.boldText]}>Phone </Text>
        <Text style={styles.fieldValue}>{farmer.phone}</Text>
      </View>
      <View style={styles.profileField}>
        <Text style={[styles.fieldLabel, styles.boldText]}>Mobile Money Number </Text>
        <Text style={styles.fieldValue}>{farmer.momo_pay_number}</Text>
      </View>
      <View style={styles.profileField}>
        <Text style={[styles.fieldLabel, styles.boldText]}>Date of Birth </Text>
        <Text style={styles.fieldValue}>{farmer.date_of_birth}</Text>
      </View>
      <View style={styles.profileField}>
        <Text style={[styles.fieldLabel, styles.boldText]}>Nationality </Text>
        <Text style={styles.fieldValue}>{farmer.nationality}</Text>
      </View>
      <View style={styles.profileField}>
        <Text style={[styles.fieldLabel, styles.boldText]}>ID Type </Text>
        <Text style={styles.fieldValue}>{farmer.id_type}</Text>
      </View>
      <View style={styles.profileField}>
        <Text style={[styles.fieldLabel, styles.boldText]}>ID Number </Text>
        <Text style={styles.fieldValue}>{farmer.id_number}</Text>
      </View>
      {farmer.id_card_photo!==null ? (
      <Image
      style={{ width: 400, height: 300 }} // Adjust width and height as needed
      source={{ uri: `data:image/png;base64,${farmer.id_card_photo}` }}
      />
      ) : null}
      <View style={styles.profileField}>
        <Text style={[styles.fieldLabel, styles.boldText]}>Postal Address </Text>
        <Text style={styles.fieldValue}>{farmer.postal_address}</Text>
      </View>
      <View style={styles.profileField}>
        <Text style={[styles.fieldLabel, styles.boldText]}>Street Address </Text>
        <Text style={styles.fieldValue}>{farmer.street_address}</Text>
      </View>
      <View style={styles.profileField}>
        <Text style={[styles.fieldLabel, styles.boldText]}>City </Text>
        <Text style={styles.fieldValue}>{farmer.city}</Text>
      </View>
    {/* <Button title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} /> */}
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileField: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC', // Light gray border
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold', // Make label text bold
  },
  fieldValue: {
    fontSize: 16,
    color: 'gray',
  },
  boldText: {
    fontWeight: 'bold', // Extra bold text style
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: 'white',
  // },
  coverPhoto: {
    height: 150,
    // backgroundColor: '#4267B2', // Facebook blue
    backgroundColor: '#eff', // Facebook blue
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: -80, // Adjust this value based on cover photo size and profile picture size
  },
  profilePictureContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'green',
    borderWidth: 3,
    borderColor: 'green', // Green border
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  editProfileButton: {
    backgroundColor: '#eff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  sellBTN:{
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  sellBTNText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editProfileButtonText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bioContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC', // Light gray border
  },
  bioText: {
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 40,
  },
  infoItem: {
    alignItems: 'center',
    margin:5
  },
  infoText: {
    fontSize: 13,
    color: 'gray',
  },
  infoNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color:"green",
  },
  
});

export default FarmerProfileScreen;
