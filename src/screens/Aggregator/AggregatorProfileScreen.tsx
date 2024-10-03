import React, { useEffect, useState,useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Divider } from "react-native-elements";
import { ProfileContext } from "../../../ProfileContext";

export default function AggregatorProfileScreen({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      title: "Aggregator Profile",
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
  const {profile} = useContext(ProfileContext)
  

  return (
    <View style={styles.container}>
      <View>
        <View style={{flexDirection:'row'}}>
          <View style={styles.Avatar}>
          <Ionicons name="person-outline" size={60} color='black'/>
          </View>
          <View style={{justifyContent:'flex-start',marginLeft:20}}>
            <Text style={{fontSize:18,color:'#7F7F7F',fontWeight:'bold',marginTop:15}}>Full Name</Text>
            <Text style={{fontSize:20,color:'black',fontWeight:'bold'}}>{`${profile.firstname} ${profile.lastname}`}</Text>
        </View>
        </View>
      </View>
      <ProfileDetails title='Phone Number' content={profile.mobile}/>
      <ProfileDetails title='Alternative Number' content='N/A'/>
      <ProfileDetails title='Address' content='N/A'/>
      
    </View>
  );
}

function ProfileDetails({title,content}) {
  return (
    <View style={{marginTop:20,marginLeft:5}}>
      <Text style={{fontSize:16,color:'#7F7F7F',fontWeight:'bold'}}>{title}</Text>
      <Text style={{fontSize:18,color:'black',marginVertical:5, marginBottom:10,fontWeight:'500'}}>{content}</Text>
      <Divider width={2} />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
     padding:50,
  },
  title: {
    padding: 24,
    fontSize: 18,
    fontWeight: "bold",
  },
  blackContainer: {
    flexDirection: "row",
    gap: 15,
    backgroundColor: "black",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    height: 70,
    marginHorizontal: 15,
    alignItems: "center",
    paddingLeft: 24,
  },
  commodityImage: {
    marginTop: 3,
    width: 35,
    height: 30,
  },
  Avatar: {
    width: 110,
    height: 110,
    borderColor:'#EDEDED',
    borderRadius: 55,
    backgroundColor:'#EDEDED',
    justifyContent:'center',
    alignItems:'center'
  }
});
