import React, { useState, useEffect } from 'react';
import { View,ScrollView, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, TextInput, Button, ToastAndroid } from 'react-native';
import FarmerAssignmentController from '../../controllers/api/FarmerAssignmentController';
import AuthTokenStore from '../../../AuthTokenStore';
import { FontAwesome5 } from '@expo/vector-icons';
import { Divider } from 'react-native-elements';
import { green } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AggregationController from '../../controllers/api/AggregationController';

const AggregationDetailScreen = ({ route,navigation }) => {
  const {order} = route.params;
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterFarmerId, setFilterFarmerId] = useState('');
  const [filterAssignmentId, setFilterAssignmentId] = useState('');
  const [editable, setEditable] = useState(false);
  const [recipientName, setRecipientName] = useState('');  
  const [recipientNumber, setRecipientNumber] = useState('');  

  const submitUpdate = async () => {
    setIsLoading(true);
    let  aggregationData = order;
    aggregationData.recipient_phone = recipientNumber;
    aggregationData.recipient_name  = recipientName;

    console.log(aggregationData);

    try {
      const data = await AggregationController.update(order.id, aggregationData);
      console.log('response from server: data.',data);
      if(data.status_code=="success"){
        // Handle success, maybe redirect or show a success message
        console.log("Response from server",data);
        console.log('Aggregation data updated successfully!');
        ToastAndroid.show('Aggregation data updated successfully!', ToastAndroid.SHORT);
        
      } else {
        console.log('an error occured ',data);
        // setError('Failed to update profile');
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
      }
      
    } catch (error) {
      // console.error('Error updating data:', error);
      // setError('Failed to update profile'+error);
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
      
    }
    setIsLoading(false);
    setEditable(false);
  }

  
  const openEditAction= () =>{
    setEditable(true);
  }

  useEffect(() => {
    console.log("data here",order);
    navigation.setOptions({ title: 'Aggregation Details' });
    // fetchAssignments();
  }, []);

 
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const render_FMRID= (farmer_id) =>{
    if(farmer_id>10000 && farmer_id<=100000){
        return farmer_id;
    }else if(farmer_id>1000 && farmer_id<=10000){
        return "0"+farmer_id;
    }else if(farmer_id>100 && farmer_id<=1000){
        return "00"+farmer_id;
    }else if(farmer_id>10 && farmer_id<=100){
        return "000"+farmer_id;
    }else if(farmer_id>0 && farmer_id<10){
        return "0000"+farmer_id;
    }
    return farmer_id;
  }

  return (
    <ScrollView> 
    <View style={styles.container}>

        <View style={styles.labelContainer}>
        <FontAwesome5 name="boxes" size={24} color="#000" style={styles.paymentIcon} />
        <Text style={styles.labelHd}>Summary of Commodities assigned to farmer TDX{render_FMRID(order.farmer_id)} </Text>
        </View>

        <Divider />
        <View style={styles.dataBox}>
        <Text style={styles.labelX}>Commodity </Text>
        <Text style={styles.filterLabel} numberOfLines={1} ellipsizeMode="tail" >{order.commodity_name}</Text>
        </View>
        <Divider />
        <View style={styles.dataBox}> 
        <Text style={styles.labelX}>Total Amount </Text> 
        <Text>Ghc{order.total_price}</Text>
        </View>
        <Divider />
        <View style={styles.dataBox}>
        <Text style={styles.labelX}>Reference Number  </Text>
        <Text style={styles.dax}>{order.reference_number}  </Text>
        </View>
        <Divider />
        
        <View style={styles.dataBox}> 
        <Text style={styles.labelX}>Recipient Name </Text> 
       

        {order.payment_status ==null?( 
      <> 
      {editable ? (
        <View> 
        <TextInput
        style={styles.input}
        onChangeText={setRecipientName}
        value={recipientName}
        placeholder="Enter recipient name"
      />
      </View>
      ) : (
        <View style={styles.ctnBox}> 
        <TouchableOpacity onPress={openEditAction}> 
        <Text style={{color:'green', marginLeft:0, 
        position:'relative',right:0}}> Edit </Text>
        </TouchableOpacity>
        <Text>{order.recipient_name} </Text>
        </View>
      )}
    </>

      ):(
        <View style={{marginBottom:10}}>
        <Text>{order.recipient_name} | Locked </Text>
        </View>
      )
    }

</View>

        <Divider />

        <View style={styles.dataBox}> 
       
        <Text style={styles.labelX}>Recipient Number  
        </Text>

      {order.payment_status ==null?( 
      <> 
      {editable ? (
        <View> 
        <TextInput
        style={styles.input}
        onChangeText={setRecipientNumber}
        value={recipientNumber}
        keyboardType="phone-pad"
        placeholder="Enter recipient number"
      />
      <TouchableOpacity onPress={submitUpdate} style={{marginBottom:15,padding:10,backgroundColor:"#eff",width:100,borderRadius:10,}}>
        <Text style={{color:"green",textAlign:'center'}}> 
        {isLoading?('Updating...'):('Update')}
         </Text>
      </TouchableOpacity>
      </View>
      ) : (
        <View style={styles.ctnBox}> 
        <TouchableOpacity onPress={openEditAction}> 
        <Text style={{color:'green', marginLeft:0, 
        position:'relative',right:0}}> Edit </Text>
        </TouchableOpacity>
        <Text>{order.recipient_phone} </Text>
        </View>
      )}
    </>

      ):(
        <View style={{marginBottom:10}}>
        <Text>{order.recipient_phone}  | Locked </Text>
        </View>
      )
    }

        <Divider />
        <View style={styles.dataBox}>
        <Text style={styles.labelX}>Total Price </Text>
        <Text>Ghc{order.total_price}</Text>
        </View>
        <Divider />
        <View style={styles.dataBox}>
        <Text style={styles.labelX}>Total Bag </Text>
        <Text>{order.total_quantity}</Text>
        </View>
        <Divider />
        <View style={styles.dataBox}>
        <Text style={styles.labelX}> Farmer ID  </Text>
        <Text style={styles.dax}>TDX{render_FMRID(order.farmer_id)}  </Text>
        </View>
        <Divider />
        <View style={styles.dataBox}> 
        <Text style={styles.labelX}>Payment Status  </Text>
        <Text>{(order.payment_status ==null)?"Pending": order.payment_status } </Text>
        </View>

        <View style={styles.dataBox}>
        <Text style={styles.labelX}> Payment Date  </Text>
        <Text style={styles.dax}>{order.payment_date}  </Text>
        </View>
        <Divider />

        </View>

        </View>
    
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    padding:10,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor:"#000",
    padding:20,
    borderRadius:10
  },
  paymentIcon: {
    marginRight: 10,
    borderWidth: 2, // Border width
    backgroundColor:"green",
    borderColor: 'green', // Border color
    borderRadius: 50, // Half of the width and height to make it circular
    padding: 10, // Padding to ensure the icon is within the circular border
    alignContent:"center", 
    textAlign:"center", 
    color:"#fff"
  },
  labelHd: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#fff', // Adjust color as needed
    marginLeft:10,
    marginRight:5,
    width:230,
  },
  filterLabel:{
    textTransform:"capitalize",
    marginBottom:5,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop:10
  },
  labelX:{
    fontWeight:"bold",
    fontSize:17,
  },
  dataBox:{
    marginBottom:20,
    marginTop:20,
  },
  dax:{
    // backgroundColor:"#eff",
    fontWeight:"bold",
    color:"green",
    // width:120,
    fontSize:15,padding:5,
    // paddingLeft:15,
    // paddingRight:15,
    borderRadius:20},
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    width:"100%",
    marginBottom:15,
    marginTop:10,
    padding:5
  },
  ctnBox:{
    flex: 1,
    padding:10,
    marginBottom:10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  iconContainer: {
    backgroundColor: '#eff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  assignmentId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#efff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    width:90,
    height:42,
  },
  buttonText: {
    color: 'green',
    fontWeight: 'bold',
    textAlign:"center",
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default AggregationDetailScreen;