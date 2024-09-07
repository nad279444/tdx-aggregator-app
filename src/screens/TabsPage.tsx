import React, { useContext } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import StartScreen from './StartScreen';

const Tab = createMaterialBottomTabNavigator();

function TabsPage() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="StartScreen" component={StartScreen} />
    </Tab.Navigator>
  );
}

export default TabsPage;