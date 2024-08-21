import React from 'react'
import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { Dot, Page } from './Slide';
import  Color  from '../../constants/Colors';
import { screenDiagonal } from '../../functions/HelperFunction';
import { CommonStyle, PAGE_HEIGHT, PAGE_WIDTH } from '../../Style/StyleSheet';

/**calculate diagonal of the screen of device */
const dgl = screenDiagonal();

const OnBoardingScreen = (props,navigation) => {

    const WORDS = [
        { head: 'Get Started', des: 'Sign up to Join a growing community of Top Aggregators accross Africa',des2:"", image:'../../../assets/icon.png' }, 
        { head: 'Jump in', des: 'Receive Commodity request from TDX and assign request to your farmers',des2:"", image:'../../../assets/icon.png'}, 
        { head: 'Finally get Cash', des: 'TDX Confirm Quality of Commodity, you get Paid by TDX instantly',des2:"", image:'../../../assets/icon.png' }];
    const translateX = useSharedValue(0);
    /** handle Translation on scroll event  */
    const scrollHandler = useAnimatedScrollHandler((event) => {
        translateX.value = event.contentOffset.x;
    });

    const Skipable = () => {
        return (
            <View style={{ flex: 1, 
            position: 'absolute', bottom: 25, 
            alignSelf: 'flex-end', paddingRight: dgl * 0.020 }}>
                <Text onPress={() => {
                    props.navigation.push('RegisterPage') 
                    // () => navigation.navigate('RegisterPage')
                    }} style={CommonStyle.input}>Skip</Text>
            </View>
        )
    }
    return (
        <>
            <Animated.FlatList
                data={WORDS}
                onScroll={scrollHandler}
                initialScrollIndex={0}
                snapToInterval={PAGE_WIDTH}
                decelerationRate="fast"
                scrollEventThrottle={16}
                horizontal
                style={style.container2}
                pagingEnabled={true}
                bounces={true}
                bouncesZoom={true}
                initialNumToRender={1}
                keyExtractor={(item, index) => item.key}
                renderItem={({ index, item }) => {
                    return (
                        <Page
                            key={index.toString()}
                            index={index}
                            title={item}
                            translateX={translateX}
                        />
                    )
                }}
            >
            </Animated.FlatList>
            <Dot data={WORDS} translateX={translateX} color={Color.blue} />
            <Skipable />

        </>
    )
}
const style = StyleSheet.create({
    pageContainer: { 
        height: PAGE_HEIGHT, 
        width: PAGE_WIDTH, 

        justifyContent: 'center' },
    container2: { 
        flex: 1, 
        // backgroundColor: Color.secondary
        backgroundColor:'green',
        // backgroundColor:"#fff",
     },
    text: { 
        fontSize: 30, 
        color: 'rgba(0,0,250,1)', 
        fontWeight: '700', 
        textAlign: "center" },
    
})

export default OnBoardingScreen;


