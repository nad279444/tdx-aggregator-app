import React, { useEffect, useState ,useContext} from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image, ScrollView } from "react-native";
import { Ionicons,FontAwesome5 } from "@expo/vector-icons";
import { DataContext } from "../../../DBContext";
import CheckBox from "react-native-elements/dist/checkbox/CheckBox";
import { Divider } from "react-native-elements/dist/divider/Divider";


export default function QualityControlScreen({ navigation }) {
  const [levelOfInfestation, setLevelOfInfestation] = useState(false);
  const [levelOfForeignMatter, setLevelOfForeignMatter] = useState(false);
  const [levelOfinsectDamage, setLevelOfinsectDamage] = useState(false);
  const [weightCheck, setWeightCheck] = useState(false);
  const [moistureContent, setMoistureContent] = useState(false);
  const [disclaimer, setDisclaimer] = useState(false);

  const { data, updateData } = useContext(DataContext);

  useEffect(() => {
    navigation.setOptions({
      title: "Sell To Direct",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("FarmerDetailScreen")}
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

  const handleCheckBoxChange = (setter) => {
    setter(prev => !prev);
  };

  const qualityControls = [
    {
      iconName: "gem",
      title: "No Foreign Matter",
      subtitle: "e.g. sand, stone",
      stateSetter: setLevelOfForeignMatter,
      stateValue: levelOfForeignMatter
    },
    {
      iconName: "spider",
      title: "No live infestation",
      subtitle: "eg. weevils",
      stateSetter: setLevelOfInfestation,
      stateValue: levelOfInfestation
      
    },
    {
      iconName: "bacterium",
      title: "No Insect Damage",
      subtitle: "eg.weevil holes",
      stateSetter: setLevelOfinsectDamage,
      stateValue: levelOfinsectDamage
    },
    {
      iconName: "tint",
      title: "Moisture Content Checked",
      subtitle: " completed",
      stateSetter: setMoistureContent,
      stateValue: moistureContent
      
    },
    {
      iconName: "weight-hanging",
      title: "Weight Checked",
      subtitle: "check completed",
      stateSetter: setWeightCheck,
      stateValue: weightCheck
    },
  ];

  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.blackBox}>
        <View style={styles.commodityContainer}>
          <View style={{ marginLeft: 20 }}>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
              {data.commodity}
            </Text>
            <Text style={{ color: "#94E081", fontSize: 14, fontWeight: "500" }}>
              {data.bags} bags, {data.weight} KG
            </Text>
          </View>
        </View>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
          {data.totalPrice} ₵
        </Text>
      </View>
      <View style={styles.greenBox}>
        <Text style={{ textAlign: "center", fontWeight: "condensed" }}>
          Quality control for{" "}
        </Text>
        <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}>
          {data.farmerName}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginTop: 10,
          marginLeft: 15,
        }}
      >
        Quality Control
      </Text>
      <View style={{ marginTop: 2 }}>
        {qualityControls.map((control, index) => (
          <View key={index}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 15,
                marginVertical: 10,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View style={{ marginTop: 15 }}>
                  <FontAwesome5 name={control.iconName} size={24} color="black" />
                </View>
                <View style={{ marginLeft: 15 }}>
                  <Text style={{fontWeight:'500'}}>{control.title}</Text>
                  <Text  style={{fontSize:14,color:'#808080'}}>{control.subtitle}</Text> 

                </View>
              </View>
              <CheckBox
                checked={control.stateValue}
                onPress={() => handleCheckBoxChange(control.stateSetter)}
                containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                checkedIcon={
                  <Ionicons name="checkbox" size={24} color="green" />
                }
                uncheckedIcon={
                  <Ionicons name="square-outline" size={24} color="black" />
                }
                checkedColor="green"
                uncheckedColor="black"
              />
            </View>
            {index < qualityControls.length - 1 && (
              <View style={{ marginHorizontal: 20 }}>
                <Divider />
              </View>
            )}
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginHorizontal: 20 }}>
        <CheckBox
          checked={disclaimer}
          onPress={() => setDisclaimer(prev => !prev)}
          containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
          checkedIcon={
            <Ionicons name="checkbox" size={24} color="green" />
          }
          uncheckedIcon={
            <Ionicons name="square-outline" size={24} color="black" />
          }
          checkedColor="green"
          uncheckedColor="black"
        />
        <Text style={{ textAlign: 'center', marginRight: 60, marginTop: 5 }}>
          I affirm that I acknowledge receipt of the specified quantity in its authorized quality.
        </Text>
      </View>
      <TouchableOpacity
        style={disclaimer?styles.greenButton:styles.button}
        onPress={() => navigation.navigate('FarmerPaymentScreen')}
        disabled={!disclaimer}
      >
        <Text style={{ fontSize: 18, color: 'white' }}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  commodityContainer: {
    flexDirection: "row",
  },
  blackBox: {
    height: 100,
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 50,
  },
  commodityImage: {
    marginLeft: 20,
    marginTop: 5,
    width: 35,
    height: 40,
  },
  greenBox: {
    height: 80,
    backgroundColor: "#94E08180",
    justifyContent: "center",
  },
  greenButton: {
    backgroundColor: "#21893E",
    marginTop: 10,
    marginBottom:35,
    height: 50,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: "center",
  },
  button: {
    marginTop: 10,
    marginBottom:35,
    height: 50,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    backgroundColor: "#D5D8DE",
    alignItems: "center",
  },
});
