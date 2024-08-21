import { StyleSheet, Dimensions } from 'react-native';

export const CommonStyle = StyleSheet.create({
  input: {
    fontSize: 16,
    // color: 'black',
    fontWeight: 'bold',
    marginRight:20,
    backgroundColor:"greenyellow",
    padding:10,
    borderRadius:20,
    width:90,
    textAlign:"center",
    color:"#000"
  },
});

export const PAGE_WIDTH = Dimensions.get('window').width;
export const PAGE_HEIGHT = Dimensions.get('window').height;