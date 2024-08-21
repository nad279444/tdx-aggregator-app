import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet,ScrollView, TouchableOpacity, Modal, Alert, ToastAndroid } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import CheckBox from 'react-native-elements/dist/checkbox/CheckBox';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FarmerAssignmentController from '../../controllers/api/FarmerAssignmentController';
import AuthTokenStore from '../../../AuthTokenStore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ActivityIndicator } from 'react-native-paper';

interface ModalData {
  id:string,
  text: string;
  subtext: string;
  additionalInfo: string;
}

interface CommodityData {
  price_per_kg: number;
}

interface Props {
  commodityData: CommodityData;
}

interface Props {
  totalAmount: number;
}

const checklistIcons = {
    'No foreign matter': 'tree',
    'No live infestation': 'bug',
    'No Insect damage': 'bug',
    'Moisture content checked': 'water',
    'Weight checked': 'balance-scale',
  };

const FarmersCommodityAssignmentScreen = ({ route, navigation }) => {
  const {farmerData,commodityData,assignmentId } = route.params;
  const [numberOfBags, setNumberOfBags] = useState('');
  const [pricePerBag, setPricePerBag] = useState('');
  
  const [grade, setGrade] = useState('');
  const [unit, setUnit] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  const [levelOfInfestation, setLevelOfInfestation] = useState('');
  const [levelOfForeignMatter, setLevelOfForeignMatter] = useState('');
  const [levelOfinsectDamage, setLevelOfinsectDamage] = useState('');
  const [weightCheck, setWeightCheck] = useState('');
  const [moistureContent, setMoistureContent] = useState('');
  let   [myCheckList, setMyCheckList] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const [phase, setPhase] = useState(1);
  const [qualityChecklist, setQualityChecklist] = useState([
    { id: 1, text: 'No foreign matter', subtext: 'e.g sand, stone', checked: false },
    { id: 2, text: 'No live infestation', subtext: 'e.g weevils', checked: false },
    { id: 3, text: 'No Insect damage', subtext: 'e.g weevils holes', checked: false },
    { id: 4, text: 'Moisture content checked', subtext: '', checked: false },
    { id: 5, text: 'Weight checked', subtext: '', checked: false },
  ]);
  const [selectedChecklistItem, setSelectedChecklistItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<ModalData>({id:'', text: '', subtext: '', additionalInfo: '' });
  const [paymentName, setPaymentName] = useState('');
  const [recipientNumber, setRecipientNumber] = useState('');
  const [isInformationAccurate, setIsInformationAccurate] = useState(false);
  const [isAgreeToTerms, setIsAgreeToTerms] = useState(false);

  const [totalWeight, setTotalWeight] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');

  const [error, setError] = useState('');
  const [errorLocation, setErrorLocation] = useState('');
  
  const formattedPrice = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS', // Currency code for Ghana Cedis
    minimumFractionDigits: 2, // Adjust minimum fraction digits as needed
  }).format(commodityData.price_per_kg);

  const formattedTotalAmount = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS', // Currency code for Ghana Cedis
    minimumFractionDigits: 2, // Adjust minimum fraction digits as needed
  }).format(totalAmount);

  useEffect(() => {
    console.log(commodityData);
    navigation.setOptions({ title: ''});
    setPricePerKg(commodityData.price_per_kg);
    const allCompleted = qualityChecklist.every(item => item.checked);
    if (allCompleted){
      // setPhase(3);
      // setMyCheckList(true);
    }

    const bags = parseInt(totalWeight);
    const price = parseFloat(pricePerKg);
    if (!isNaN(bags) && !isNaN(price)) {
      const total = bags * price;
      setTotalAmount(parseFloat(total.toFixed(2)));
    }

  }, [numberOfBags, pricePerBag,pricePerKg,totalWeight, qualityChecklist]);


  const validatePhone = (input) => {
    const phoneRegex = /^(?:\+233\d{9}|0\d{9})$/;
    return phoneRegex.test(input);
  };

  const handleCalculateTotal = () => {
    const bags = parseInt(totalWeight);
    const price = parseFloat(pricePerKg);
    if (!isNaN(bags) && !isNaN(price)) {
      const total = bags * price;
      setTotalAmount(parseFloat(total.toFixed(2)));
    }

    const total = parseFloat(totalWeight)*parseFloat(pricePerKg);
    console.log(total);
    // setTotalAmount(parseFloat(total.toFixed(2)));
    if(bags>0 && price>0){
    setPhase(2);
    }

  };

  const handleChecklistItemToggle = (id) => {
    const updatedChecklist = qualityChecklist.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setQualityChecklist(updatedChecklist);
    const selectedItem = updatedChecklist.find(item => item.id === id && item.checked);
    
    // console.log(selectedItem.id);
    if(selectedItem){
      console.log("data "+selectedItem.id);
      myCheckList+=1;
      setMyCheckList(myCheckList);
    }else{
      console.log("empty::");
      myCheckList-=1;
      setMyCheckList(myCheckList);
    }

    console.log(myCheckList);
    
    if (selectedItem) {
      setSelectedChecklistItem(selectedItem);
      setModalData({id:selectedItem.id.toString(), text: selectedItem.text, subtext: selectedItem.subtext, additionalInfo: '' });
    
        if(selectedItem.id.toString()=="1"){ 
          setLevelOfInfestation("1");
        }
      
      if(selectedItem.id.toString()=="2"){ 
        setLevelOfForeignMatter("1");
      }

      if(selectedItem.id.toString()=="3"){ 
        setLevelOfinsectDamage("1");
      }

      if(selectedItem.id.toString()=="4"){ 
        setWeightCheck("1");
      }

      if(selectedItem.id.toString()=="5"){ 
        setMoistureContent("1");
      }
     
      // setModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleModalSave = () => {
    if (modalData.additionalInfo.trim() !== '') {
      setModalVisible(false);
      const updatedChecklist = qualityChecklist.map(item =>
        item.id === selectedChecklistItem.id ? { ...item, checked: true } : item
      );
      setQualityChecklist(updatedChecklist);
      console.log(modalData);
      if(modalData.id.toString()=="1"){ 
        setLevelOfInfestation(modalData.additionalInfo);
      }

      if(modalData.id.toString()=="2"){ 
        setLevelOfForeignMatter(modalData.additionalInfo);
      }

      if(modalData.id.toString()=="3"){ 
        setLevelOfinsectDamage(modalData.additionalInfo);
      }

      if(modalData.id.toString()=="4"){ 
        setWeightCheck(modalData.additionalInfo);
      }

      if(modalData.id.toString()=="5"){ 
        setMoistureContent(modalData.additionalInfo);
      }
  
    } else {
      Alert.alert('Please enter additional information.');
    }
  };

// totalAmount

// const randomString = generateRandomString();


const handleProceedPhase4 = async () => {
setPhase(3);
}

  const handleSubmit = async () => {
    setIsLoading(true);
    const userID = await AuthTokenStore.getUserID(); 
    console.log("commodity ID now: ",commodityData.item_id);
    console.log(modalData);
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomString = '';
    let length = 4;
    for (let i = 0; i < length; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const currentDate = new Date();
    const day   = currentDate.getDay(); 
    const month = currentDate.getMonth() + 1;
    const year  = currentDate.getFullYear(); 
    
    const newAssignmentData = {
      farmer_id: farmerData.id,
      assignment_id: assignmentId, // You need to define assignmentId
      assigned_items_id: commodityData.item_id, // You need to define assignedItemsId
      aggregator_id: userID, // You need to define aggregatorId
      total_price:(parseFloat(pricePerBag) * parseFloat(numberOfBags)).toString(),
      total_quantity: numberOfBags,
      total_bags: numberOfBags,
      price_per_unit_of_mearsure:pricePerKg,
      total_weight_supplied:totalWeight,
      level_of_infestation: levelOfInfestation,
      level_of_foreign_matter: levelOfForeignMatter,
      level_of_insect_damage: levelOfinsectDamage,
      weight_check: weightCheck,
      moisture_content: moistureContent,
      recipient_name: paymentName,
      recipient_phone: recipientNumber,
      referenece_number: ""//randomString
    };

    let error_msg = "";
    //
    
    if( numberOfBags!=="" &&
        numberOfBags !=="" &&
        pricePerKg !=="" &&
        totalWeight !=="" &&
        levelOfInfestation !=="" &&
        levelOfForeignMatter !=="" &&
        levelOfinsectDamage !=="" &&
        weightCheck !=="" &&
        moistureContent !=="" &&
        paymentName !=="" &&
        recipientNumber !=="" &&
        error_msg ==""
    ){

      try {
        console.log("data to farmer assignment Server --- ",newAssignmentData);
        const result = await  FarmerAssignmentController.store(newAssignmentData, farmerData.id);
        console.log(result);
        if(result.status_code=="200" && result.status=="success"){
          // Reset all state variables
          setNumberOfBags('');
          setPricePerBag('');
          setGrade('');
          setUnit('');
          setTotalAmount(0);
          setLevelOfInfestation('');
          setLevelOfForeignMatter('');
          setLevelOfinsectDamage('');
          setWeightCheck('');
          setMoistureContent('');
          setIsLoading(false);
          setPhase(1);
          setQualityChecklist([
            { id: 1, text: 'No foreign matter', subtext: 'e.g sand, stone', checked: false },
            { id: 2, text: 'No live infestation', subtext: 'e.g weevils', checked: false },
            { id: 3, text: 'No Insect damage', subtext: 'e.g weevils holes', checked: false },
            { id: 4, text: 'Moisture content checked', subtext: '', checked: false },
            { id: 5, text: 'Weight checked', subtext: '', checked: false },
          ]);
          setSelectedChecklistItem(null);
          setModalVisible(false);
          setModalData({id:'', text: '', subtext: '', additionalInfo: '' });
          setPaymentName('');
          setRecipientNumber('');
          setIsInformationAccurate(false);
          setIsAgreeToTerms(false);
          setTotalWeight('');
          setPricePerKg('');
          setIsLoading(false);
          navigation.navigate('CompleteScreen', { message: result.message,assignmentId:assignmentId});
        }else{
          ToastAndroid.showWithGravity(result.message, ToastAndroid.SHORT, ToastAndroid.CENTER);
          error_msg = result.message;
          setError(error_msg);
        }
        // Handle response as needed
      } catch (error){
        error_msg = error;
        setError(error_msg);
        console.error('Error submitting assignment:', error);
      }

    }


  };

  const handleProceedToPayment = () => {
    let error_msg
    if (!isInformationAccurate) {
      error_msg = 'Please confirm that the information provided is accurate.';
      setError(error_msg);
      Alert.alert('Please confirm that the information provided is accurate.');
      return;
    }
    if (!isAgreeToTerms) {
      error_msg = 'Please agree to the Terms and Conditions.';
      setError(error_msg);
      Alert.alert('Please agree to the Terms and Conditions.');
      return;
    }

    if (!validatePhone(recipientNumber)) {
      // setErrorLocation("emailOrPhone");
      error_msg = 'Please enter a valid phone number.';
      setError(error_msg);
      ToastAndroid.showWithGravity(error_msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
      return;
    }
    
    handleSubmit(); // Call the submit function here
  };

  const renderChecklistItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.checklistItem}
      onPress={() => handleChecklistItemToggle(item.id)}
      >
      <View style={styles.checklistIcon}>
      {/* name={item.id === 5 ? 'balance-scale' : 'bug'} */}
        <FontAwesome5 name={checklistIcons[item.text]} size={34} color="#000" />
      </View>
      <View style={styles.checklistContent}>
        <Text style={styles.checklistText}>{item.text}</Text>
        <Text style={styles.checklistSubtext}>{item.subtext}</Text>
      </View>
      {item.checked && <FontAwesome5 name="check-circle" style={{
        fontSize:34, 
        color:"#28a745",
        marginRight:15 
      }} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{backgroundColor:"#fff"}}> 
    <View style={styles.container}>
      {/* {commodityData.price_per_kg} */}
      {/* <Text> Price per Kg  / {pricePerKg}  </Text> */}
      {phase === 1 && (
        <>
          <View style={styles.labelContainer}>
          <FontAwesome5 name="boxes" size={24} color="#000" style={styles.paymentIcon} />
          <Text style={styles.labelHd}>Provide weight and number of bags supplied by farmer below </Text>
          </View>
          <View style={{alignContent:"center",backgroundColor:"#eff",padding:20,marginTop:0,marginBottom:30}}>
          <Text style={{textAlign:"center"}}> Number of Kg for </Text>
          <Text style={{textAlign:"center",fontWeight:"bold",fontSize:20}}> {farmerData.first_name} {farmerData.last_name} </Text>
          <Text style={{textAlign:"center"}}> Price Per Kg /  {formattedPrice} </Text>
          </View>
          <Divider />

          <Text style={styles.labelx}>Number of bags </Text>
          <TextInput
            style={styles.input}
            onChangeText={setNumberOfBags}
            value={numberOfBags}
            keyboardType="numeric"
            placeholder="Enter number of bags"
          />
          <Text style={styles.labelx}>Enter weight in Kg </Text>
          <TextInput
            style={styles.input}
            onChangeText={setTotalWeight}
            value={totalWeight}
            keyboardType="numeric"
            placeholder="Enter weight in Kg"
          />

          <TextInput
            style={styles.input}
            // style={styles.totalAmount}
            value={`${formattedTotalAmount}`}
            editable={false}
          />
          <View style={styles.BillBox}>
          <Text> Bill Amount  </Text>
          <Text style={styles.totalAmount}>Total Amount: {formattedTotalAmount}</Text>
          </View>
          <TouchableOpacity style={styles.actionButton} onPress={handleCalculateTotal}>
            <Text style={styles.actionButtonText}>Continue </Text>
          </TouchableOpacity>
         
          </>
      )}

      {/* Phase 2 */}
      {phase === 2 && (
    <>
      {/* <Text style={styles.phaseTitle}>Phase 2: Quality Control Check </Text> */}
      <View style={styles.headBox}> 
      <Text style={styles.phaseTitle}>Quality Control Check </Text>
      <Text> Check the parameters below after quality control measures have been performed </Text>
      </View>
      <TouchableOpacity style={{padding:10,backgroundColor:"#eff",}} onPress={()=>{
        setPhase(1);
      }}>
        <Text style={{color:"green"}} > Back </Text>
      </TouchableOpacity>

      <Divider />
      {qualityChecklist.map(renderChecklistItem)}


  <View style={{marginTop:30,marginBottom:30}}>
  {
  (myCheckList==5) &&
  <View>
    <View style={{backgroundColor:"#ffdada",padding:10, }}>
    <Text style={{color:"red"}}> By clicking continue, you affirm that you have acknowledged receipt of the specified quantity in its authorized quality.  </Text>
    </View>
  <Text>

    <View> 
  <TouchableOpacity style={styles.proceedButton} onPress={handleProceedPhase4}>
        <Text style={styles.proceedButtonText}>Proceed </Text>
      </TouchableOpacity>
  </View>
  
  </Text>
  </View>
  }
  </View>

        </>
      )}

  
      {phase === 3 && (
        <View>
          <View style={styles.labelContainer}>
            <FontAwesome name="credit-card" size={24} color="#000" style={styles.paymentIcon} />
            <Text style={styles.labelHd}>Provide us with accurate Payment Information for this farmer</Text>
          </View>
          <TouchableOpacity style={{padding:10,backgroundColor:"#eff",}} onPress={()=>{
            setPhase(2);
          }}>
            <Text style={{color:"green"}}> Back </Text>
          </TouchableOpacity>
          <Divider />
          <Text style={styles.labelx}>Recipient Name:</Text>
          {/* <Text style={styles.labelx}>Enter weight in Kg </Text> */}
          <TextInput
            style={styles.input}
            onChangeText={setPaymentName}
            value={paymentName}
            placeholder="Enter payment name"
          />
          <Text style={styles.labelx}>Recipient Number:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setRecipientNumber}
            value={recipientNumber}
            keyboardType="phone-pad"
            placeholder="Enter recipient number"
          />
           <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkboxItem}
              onPress={() => setIsInformationAccurate(!isInformationAccurate)}
            >
              <CheckBox checked={isInformationAccurate} />
              <Text style={styles.checkboxLabel}>I confirm that the information provided is accurate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkboxItem}
              onPress={() => setIsAgreeToTerms(!isAgreeToTerms)}
            >
              <CheckBox checked={isAgreeToTerms} />
              <Text style={styles.checkboxLabel}>I confirm receipt of the commodities from this farmer </Text>
            </TouchableOpacity>
          </View>
      
      <View style={{width:360,margin:10}}> 
      <Text style={{color:"red"}}> {error}</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#006400" style={styles.loadingIndicator} />
      ) : (
        <TouchableOpacity style={styles.proceedButton} onPress={handleProceedToPayment}>
        <Text style={styles.proceedButtonText}>Request Payment</Text>
      </TouchableOpacity>
      )}

        </View>
        
      )}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleModalClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalData?.text}</Text>
            <Text style={styles.modalSubtext}>{modalData?.subtext}</Text>
            <TextInput
              style={styles.modalInput}
              onChangeText={(text) => setModalData({ ...modalData, additionalInfo: text })}
              value={modalData?.additionalInfo}
              keyboardType="numeric"
              placeholder="Enter additional information"
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleModalSave}>
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View> 
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor:"#000",
    padding:20,
    borderRadius:10
  },
  loadingIndicator: {
    marginTop: 20,
  },
  labelx:{
    fontWeight:'bold',
    margin:5,
    marginTop:10,},
  headBox:{
    marginBottom:25,
    marginLeft:10,
    marginRight:10,
  },
  BillBox:{
    backgroundColor:"#eff",
    padding:15,
    borderRadius:10,
    marginBottom:20
  },
  paymentIcon: {
    marginRight: 10,
    borderWidth: 2, // Border width
    backgroundColor:"green",
    borderColor: "green", // Border color
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
    marginLeft:10
  },
  
  phaseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  checklistIcon: {
    margin: 20, // Adjust the margin as needed
  },
  farmerBox: {
    backgroundColor: "#eff",
    padding: 15,
    marginBottom: 10, // Add marginBottom if needed
    borderRadius: 5, // Add borderRadius if needed
  },
  checkboxContainer: {
    marginTop: 5,
    width:300,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding:10,
  },
  checkboxLabel: {
    marginLeft:0,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  actionButton: {
    // backgroundColor: '#007bff',
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingVertical: 10,
  },
  checklistIconContainer: {
    marginRight: 10,
  },
  checklistContent: {
    flex: 1,
  },
  checklistText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  checklistSubtext: {
    fontSize: 14,
    color: '#666666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    minWidth: '80%',
  },
  label:{
    fontSize: 1,
    // fontWeight: 'bold',
    marginTop: 10,
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtext: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666666',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButton: {
    // backgroundColor: '#007bff',
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  proceedButton: {
    // backgroundColor: '#007bff',
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width:360
  },
  proceedButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});




export default FarmersCommodityAssignmentScreen;