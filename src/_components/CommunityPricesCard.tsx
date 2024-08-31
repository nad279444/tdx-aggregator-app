import React,{useEffect} from 'react'
import {Text,View,StyleSheet,TouchableOpacity} from 'react-native'
import {Ionicons} from '@expo/vector-icons'


export default function CommunityPricesCard(){
  
  return (
    <View style={styles.container}>
      <View>
        <Text style={{color:'black',fontSize:20, fontWeight: 'bold'}}>Location</Text>
        <Text  style={{color:'grey', fontWeight: '400'}} >Last Updated: Date</Text>
        </View>
        <TouchableOpacity style={styles.Button}>
            <Text style={{color:'white',margin:0,padding:0}}> Show Prices</Text>
        </TouchableOpacity>
      
    </View>
  )
}

const styles = StyleSheet.create({
   container: {
    backgroundColor: '#fff',
    margin:20,
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