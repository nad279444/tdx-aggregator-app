import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';

const AuthPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
     <StatusBar backgroundColor="#000000" barStyle="light-content" />
      <Image source={require('../../../assets/icon.png')} style={styles.logo} />
      <Text style={styles.WelcomeText}> Welcome to <Text style={{color:'green',fontWeight:'bold'}}>TDX </Text> Aggregator Platform </Text>
      <Text style={styles.subText}> Enjoy a Seamless  Trading Experience   </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity  onPress={() => navigation.navigate('SignIn')} style={styles.button}>
          <Text style={styles.buttonText}> Sign In </Text>
        </TouchableOpacity>
        {/* <Divider /> */}
        <TouchableOpacity  onPress={() => navigation.navigate('OnBoardingScreen')} style={[styles.button, { marginTop: 10 }]}>
          <Text style={styles.buttonText}> Register </Text>
        </TouchableOpacity>
        <Text style={{color:"#eee",marginTop:80,fontSize:10}}>Copy Right 2024 TDX Ltd. </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:"#242b38"
    backgroundColor:'#000' //'#ffffff', // Background color
  },
  WelcomeText:{
    textAlign:"center",
    color:"#eee",
    marginBottom:10,
    fontSize:18,
  },
  subText:{
    color:"#eee",
    marginBottom:100,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 80,
    marginTop:70,
    borderColor:"green",
    padding:20,
  },
  buttonsContainer: {
    marginTop:80,
    alignItems: 'center',
  },
  button: {
    width: 330,
    height: 50,
    backgroundColor:'#006400', // Deep green color
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 10,
    marginBottom:3,
  },
  buttonText: {
    color: '#ffffff', // White color
    fontSize: 18,
    fontWeight: 'bold',
  },
});

// Set navigation options using navigationOptions property within the component

// AuthPage.navigationOptions = {
//   headerShown: false,
// };

export default AuthPage;