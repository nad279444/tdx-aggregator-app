import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 

const NotificationIcon = ({ unreadCount, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
      <MaterialIcons name="notifications" size={36} color="white" />
      
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount}</Text>
          
        </View>
    
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
    marginRight: 16,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 50,
    width: 20, // Ensures text fits in the badge
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3, // Adds padding for larger numbers
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default NotificationIcon;
