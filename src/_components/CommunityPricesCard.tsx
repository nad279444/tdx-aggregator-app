import React,{useEffect} from 'react'
import {Text,View,StyleSheet,TouchableOpacity} from 'react-native'
import {Ionicons} from '@expo/vector-icons'


export default function CommunityPricesCard({location,date,onShowPrices}){
  
  return (
    <View style={styles.container}>
      <View>
        <Text style={{color:'black',fontSize:20, fontWeight: 'bold'}}>{location}</Text>
        <Text  style={{color:'grey', fontWeight: '400'}} >Last Updated: {date}</Text>
        </View>
        <TouchableOpacity style={styles.Button} onPress={onShowPrices}>
            <Text style={{color:'white'}}> Show Prices</Text>
        </TouchableOpacity>
      
    </View>
  )
}

const styles = StyleSheet.create({
   container: {
    backgroundColor: '#fff',
    marginHorizontal:20,
    marginTop:40,
    borderRadius:10,
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:20,
    paddingVertical:20
    
   },
   Button: {
    backgroundColor: '#21893E',
    borderRadius:50,
    paddingHorizontal:20,
    justifyContent: 'center',
    alignItems: 'center'
    
   }
})