import {useEffect}from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { FontAwesome5,Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CompleteScreen = ({ route, navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      title: "Sell To Direct",
      headerTitleAlign: "center",
      headerLeft: () => null,
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginRight: 16 }}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

    
  
    return(
    <View style={styles.container}>
      <FontAwesome5 name="heart" size={60} color="#21893E" solid/>
      <Text style={styles.title}> Thank you for Selling to TDX ! </Text>
      <Text style={styles.message}>We'll process your sales order as soon as possible. We will keep you updated on the progress through the app.</Text>
      <View style={{width:'100%',position:'absolute',bottom:50}} >
      <TouchableOpacity
          style={styles.greenButton }
          onPress={() => {}}
        >
          <Text style={{ fontSize: 18, color: 'white' }}>View Order Status</Text>
       </TouchableOpacity>
      </View>
      

    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      position:'relative'
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 20,
      textAlign: 'center',
      marginHorizontal:70
    },
    message: {
      fontSize: 18,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    nxtButton: {
      marginTop: 30,
      backgroundColor: '#fff', // White background
      borderWidth: 1,
      borderColor: 'green', // Green border
      borderRadius: 2,
      color:"#fff",
      width:200,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    nxtButton2:{
      marginTop: 10,
      backgroundColor: 'green', // White background
      borderWidth: 1,
      borderColor: 'green', // Green border
      borderRadius: 2,
      width:200,
      height: 50,
      
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: '#006400', // Green text
      fontSize: 16,
      fontWeight: 'bold',
    },

    buttonText2: {
        color: '#fff', // Green text
        fontSize: 16,
        fontWeight: 'bold',
      },
      greenButton: {
        backgroundColor: "#21893E",
        marginTop: 5,
        height: 50,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: "#D5D8DE",
        borderRadius: 4,
        paddingVertical: 10,
        alignItems: "center",
      },
  });
  
  export default CompleteScreen;