import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  RefreshControl,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function NotificationDetailScreen({navigation,route}) {
  const {title,description} = route.params
  useEffect(() => {
    navigation.setOptions({
      title: 'Notifications',
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginRight: 16 }}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 22,fontWeight: 'bold',marginTop: 20}}>{title}</Text>
      <Text style={{marginTop: 10}}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 30,
   }
})