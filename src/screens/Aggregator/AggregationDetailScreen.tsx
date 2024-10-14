import React,{useEffect,useState} from 'react'
import {View,Text,TouchableOpacity, StyleSheet,Image} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import { Divider } from 'react-native-elements'
import ListComponent from '../../_components/ListComponent'


export default function AggregationDetailScreen ({navigation,route}){
 const {commodityName,image,quantity,price,date,bags,farmer} = route.params
const totalPrice = price * Number(quantity)
const whiteImage = image.replace(".png", "-white.png");



  useEffect(() => {
    navigation.setOptions({
      title: 'My Aggregates',
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("MyAggregatesScreen")}
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

  return (
    <View>
      <Text style={styles.title}>{commodityName} - {date}</Text>
      <View style={styles.blackContainer}>
      <Image source={{ uri: whiteImage }} style={styles.commodityImage} />
        <Text style={{color:'white',fontSize:18,}}>{commodityName}</Text>
        </View>
       <ListComponent label='Farmer' value={farmer} />
       <ListComponent label='No. of bags' value={bags} />
       <ListComponent label='Price' value={ `₵${price}`}  /> 
       <ListComponent label='Weight' value={`${quantity} KG`} />
       <ListComponent label='Total Price' value={ `₵${totalPrice}`} textStyle={{color:'#21893E',fontWeight:'bold',fontSize:16,}}/>
       
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  }, 
  title:{
    padding:24,
    fontSize:18,
    fontWeight:'bold',
  },
  blackContainer:{
    flexDirection: 'row',
    gap:15,
    backgroundColor:'black',
    borderTopRightRadius:10,
    borderTopLeftRadius: 10,
    height: 70,
    marginHorizontal:15,
    alignItems: 'center',
    paddingLeft:24
  } ,
  commodityImage: {
    
    marginTop: 3,
    width: 35,
    height: 30,
  },
 
})