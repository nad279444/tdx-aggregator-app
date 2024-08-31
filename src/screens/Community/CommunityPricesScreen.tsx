import React,{useEffect} from 'react'
import {Text,View,StyleSheet,TouchableOpacity} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import CommunityPricesCard from '../../_components/CommunityPricesCard';


export default function CommunityPricesScreen({navigation}){
  useEffect(() => {
    navigation.setOptions({
      title: 'Community Prices',
      headerTitleAlign: 'center',
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
  return (
    <View>
      <CommunityPricesCard />
    </View>
  )
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    flexDirection:'row',
    justifyContent:'space-between'
   }
})