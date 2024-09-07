import React,{useContext, useState} from 'react'
import{View,Text,TextInput,StyleSheet,ScrollView,TouchableOpacity,ToastAndroid,ActivityIndicator} from 'react-native'
import PasswordInput from '../../_components/PasswordInput';
import auth from '../../controllers/auth/auth';
import { AuthContext } from '../../../AuthContext';


export default function Registration ({navigation}) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [community, setCommunity] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const {authContext} = useContext(AuthContext)

  


  const validatePhone = (input) => {
    const phoneRegex = /^\d{10}$/; // Exactly 10 digits
    return phoneRegex.test(input);
  };
  
  async function handleRegistration () {
    setIsLoading(true)
    try {
      const response = await auth.signUp({
        fullname:name,
        mobile:phoneNumber,
        password,
        confirmpassword:confirmPassword,
        community,
      })
      if(!response.error){
        ToastAndroid.showWithGravityAndOffset(
          response.challenge,
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50,
        );
      }
      ToastAndroid.showWithGravityAndOffset(
        response.message,
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        50,
    )
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(
          error.message,
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50,
      )
    } finally {
      setIsLoading(false)
    }
    navigation.navigate('SignIn')
    setName(''),
    setPhoneNumber(''),
    setPassword(''),
    setConfirmPassword(''),
    setCommunity('')
  }

  const handlePhoneChange = (input) => {
    setPhoneNumber(input);
    if (validatePhone(input)) {
      setPhoneError(""); // Clear error if input is valid
    } else {
      setPhoneError("✗ Invalid phone number."); // Set error if input is invalid
    }
  };


  return (
    <ScrollView>
    <View style = {styles.container}>
        <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
        <Text style={styles.title}>Create New Account</Text>
        <Text style={styles.label}>Join <Text style={{color:'green',fontWeight:'bold'}}> TDX</Text> aggregator community</Text>
          <Text style={styles.inputTitle}>Full Name</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder="Enter Full Name"
            onChangeText={(text) => setName(text)}
            value={name}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>Phone Number</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder="Enter Your Phone Number"
            onChangeText={handlePhoneChange}
            keyboardType="numeric"
            value={phoneNumber}
          />
        </View>
      </View>
      {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
      <PasswordInput 
        password={password} 
        setPassword={setPassword} 
        confirmPassword={confirmPassword} 
        setConfirmPassword={setConfirmPassword} 
        styles={styles} 
      />
       <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>Community</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="left"
            placeholder="Community Name"
            onChangeText={(text) => setCommunity(text)}
            value={community}
          />
        </View>
      </View>
    </View>
    <TouchableOpacity
        style={name && phoneNumber && password && community? styles.greenButton : styles.disabledButton}
        onPress={handleRegistration}
        disabled={!name || !phoneNumber || !password || !community || isLoading}
      >
        <Text style={{ fontSize: 18, color: "white" }}>
          Register
        </Text>
        {isLoading &&   <ActivityIndicator style={{position: 'absolute',top: 15, right: 30}} size="small" color="#fff" />}
      </TouchableOpacity>
      <TouchableOpacity style={{alignItems: 'flex-end',marginRight:20}} onPress={()=> navigation.navigate('SignIn')}>
        <Text>Already have an account? <Text style={{color: 'green'}}>Login</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    position: 'relative'
  },
  inputGroup: {
    flex: 1,
    position: "relative",
  },
  inputTitle: {
    marginLeft: 10,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  visibleIcon : {
    position: 'absolute',
    top: 50,
    right:30
  },
  nameInput: {
    height: 60,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 4,
    padding: 10,
    marginHorizontal: 10,
    textAlign: "right",
    backgroundColor: "#FFFFFF",
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  validationContainer: {
    marginTop: 10,
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: 'green',
    marginLeft:10,
    paddingTop: 20
  },
  label: {
    fontSize: 14,
    marginBottom: 20,
    marginLeft: 10
  },
  greenButton: {
    backgroundColor: "#21893E",
    marginVertical: 10,
    height: 50,
    marginHorizontal: 25,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: "center",
    position: 'relative'
  },
  disabledButton: {
    marginVertical: 10,
    height: 50,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    backgroundColor: "#D5D8DE",
    alignItems: "center",
  },
  errorText: {
    color: 'red',
    marginLeft: 10,
    marginTop: 5,
  },
})