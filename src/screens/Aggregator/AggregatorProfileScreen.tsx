import React, { useContext, useEffect, useState } from 'react';
import { View, Text,Image,TouchableOpacity, Button, StyleSheet } from 'react-native';
import AggregatorController from '../../controllers/api/AggregatorController';
import { ScrollView } from 'react-native-gesture-handler';
import { Divider } from 'react-native-elements';
import AuthTokenStore from '../../../AuthTokenStore';
import AuthContext from '../../../AuthContext';

const AggregatorProfileScreen = ({ navigation }) => {
  const [aggregator, setAggregator] = useState(null);

  const { signOut } = useContext(AuthContext);
  
  const handleSignOut = () => {
    signOut();
  };


  useEffect(() => {
    fetchAggregatorProfile();
  }, []);

  const fetchAggregatorProfile = async () => {
    try {
      const id = await AuthTokenStore.getUserID(); 
      const response = await AggregatorController.show(id);
      if (response) {
        setAggregator(response.data);
      }
    } catch(error){
      console.error('Error fetching aggregator profile:', error);
    }
  };

  if(!aggregator) {
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
          <Text style={{color:"#fff",fontSize:30,textTransform:"uppercase"}}> {aggregator.first_name[0]} </Text>
        </View>
        <Divider style={{marginTop:10,marginBottom:5}} />
        <View> 
        <Text style={styles.userName}>{aggregator.first_name} {aggregator.last_name}</Text>
        <Text style={styles.userInfo}>{aggregator.email||aggregator.phone}</Text>
        </View>
        <TouchableOpacity style={styles.editProfileButton} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{marginTop:20}} onPressIn={handleSignOut}>
       <Text>Sign Out </Text>
    </TouchableOpacity>
    
      </View>
      {/* phase === 1 && ( */}
      {aggregator.bio_text!=="" &&(
      <>
      <Divider style={{marginTop:30,marginBottom:5}} />
      <View style={styles.bioContainer}>
        <Text style={styles.bioText}>
          {aggregator.bio_text}
        </Text>
      </View>
      </>
      )}
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoNumber}> {aggregator.no_of_trade} </Text>
          <Text style={styles.infoText}>No of Trades </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoNumber}> {aggregator.approval_rating} </Text>
          <Text style={styles.infoText}>Approval Ratings</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoNumber}> {aggregator.completed} </Text>
          <Text style={styles.infoText}>Completed </Text>
        </View>
      </View>
      <Divider ></Divider>
      <View style={styles.profileField}>
        <Text style={[styles.fieldLabel, styles.boldText]}>Phone </Text>
        <Text style={styles.fieldValue}>{aggregator.phone}</Text>
      </View>
      <View style={styles.profileField}>
        <Text style={[styles.fieldLabel, styles.boldText]}>Mobile Money Number </Text>
        <Text style={styles.fieldValue}>{aggregator.momo_pay_number}</Text>
      </View>
      <View style={styles.profileField}>
        <Text style={[styles.fieldLabel, styles.boldText]}>Date of Birth </Text>
        <Text style={styles.fieldValue}>{aggregator.date_of_birth}</Text>
      </View>
      <View style={styles.profileField}>
        <Text style={[styles.fieldLabel, styles.boldText]}>Nationality </Text>
        <Text style={styles.fieldValue}>{aggregator.nationality}</Text>
      </View>
      <View style={styles.profileField}>
        <Text style={[styles.fieldLabel, styles.boldText]}>ID Type </Text>
        <Text style={styles.fieldValue}>{aggregator.id_type}</Text>
      </View>
      <View style={styles.profileField}>
        <Text style={[styles.fieldLabel, styles.boldText]}>ID Number </Text>
        <Text style={styles.fieldValue}>{aggregator.id_number}</Text>
      </View>
      <View style={{margin:12,width:300}}>
      {aggregator.id_card_photo!==null ? (
      <Image
      style={{ width: 360, height: 300,borderRadius:10 }} // Adjust width and height as needed
      source={{ uri: `data:image/png;base64,${aggregator.id_card_photo}` }}
      />
      ) : null}
      </View>
      <View style={styles.profileField}>
        <Text style={[styles.fieldLabel, styles.boldText]}>Postal Address </Text>
        <Text style={styles.fieldValue}>{aggregator.postal_address}</Text>
      </View>
      <View style={styles.profileField}>
        <Text style={[styles.fieldLabel, styles.boldText]}>Street Address </Text>
        <Text style={styles.fieldValue}>{aggregator.street_address}</Text>
      </View>
      <View style={styles.profileField}>
        <Text style={[styles.fieldLabel, styles.boldText]}>City </Text>
        <Text style={styles.fieldValue}>{aggregator.city}</Text>
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
    textTransform:"capitalize"
  },
  userInfo: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  editProfileButton: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  editProfileButtonText: {
    color: 'white',
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
    backgroundColor:"#eff",
    padding:15,
    borderRadius:5,
  },
  infoText: {
    fontSize: 13,
    color: '#000',
    marginTop:6,
  },
  infoNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color:"green",
  },
  
});

export default AggregatorProfileScreen;
