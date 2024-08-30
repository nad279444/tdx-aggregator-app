import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';

export default function ListComponent({ label, value, textStyle={} }) {
  return (
    <View style={{ backgroundColor: 'white', borderColor: 'white', marginHorizontal: 15 }}>
      <View style={styles.listContainer}>
        <Text style={textStyle}>{label}</Text>
        <Text style={[styles.valueText, textStyle]}>{value}</Text>
      </View>
      <Divider style={{ backgroundColor: 'black', height: 2, marginHorizontal: 15 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  valueText: {
    fontWeight: 'bold',
  },
});
