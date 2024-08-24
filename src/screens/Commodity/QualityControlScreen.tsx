import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image, ScrollView } from "react-native";
import { Ionicons,FontAwesome5 } from "@expo/vector-icons";
import CheckBox from "react-native-elements/dist/checkbox/CheckBox";
import { Divider } from "react-native-elements/dist/divider/Divider";


export default function QualityControlScreen({ navigation }) {
  const [levelOfInfestation, setLevelOfInfestation] = useState(false);
  const [levelOfForeignMatter, setLevelOfForeignMatter] = useState(false);
  const [levelOfinsectDamage, setLevelOfinsectDamage] = useState(false);
  const [weightCheck, setWeightCheck] = useState(false);
  const [moistureContent, setMoistureContent] = useState(false);
  const [disclaimer, setDisclaimer] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "Sell To Direct",
      headerTitleAlign: "center",
      headerLeft: () => null,
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
      title: "Moisture Content",
      subtitle: "below 14%",
      stateSetter: setMoistureContent,
      stateValue: moistureContent
    },
    {
      iconName: "bacterium",
      title: "No Insect Damage",
      subtitle: "consistent color",
      stateSetter: setLevelOfinsectDamage,
      stateValue: levelOfinsectDamage
    },
    {
      iconName: "flask",
      title: "No Chemical Residue",
      subtitle: "safe for consumption",
      stateSetter: setWeightCheck,
      stateValue: weightCheck
    },
    {
      iconName: "leaf",
      title: "No Pest Infestation",
      subtitle: "free from pests",
      stateSetter: setLevelOfInfestation,
      stateValue: levelOfInfestation
    },
  ];

  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.blackBox}>
        <View style={styles.commodityContainer}>
          <Image
            source={require("../../../assets/Maize.jpg")}
            style={styles.commodityImage}
          />
          <View style={{ marginLeft: 20 }}>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
              Yellow Maize
            </Text>
            <Text style={{ color: "#94E081", fontSize: 14, fontWeight: "500" }}>
              24 bags, 2400KG
            </Text>
          </View>
        </View>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
          64,000 ₵
        </Text>
      </View>
      <View style={styles.greenBox}>
        <Text style={{ textAlign: "center", fontWeight: "condensed" }}>
          Quality control for{" "}
        </Text>
        <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}>
          Ebo Taylor
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
                  <Text>{control.title}</Text>
                  <Text>{control.subtitle}</Text>
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
        onPress={() => {}}
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
    marginTop: 5,
    height: 50,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: "center",
  },
  button: {
    marginTop: 5,
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
