import React from "react"
import { StyleSheet, Text, Dimensions, View, Image } from "react-native";
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from "react-native-reanimated";

import { screenDiagonal } from '../../functions/HelperFunction';
import { PAGE_HEIGHT, PAGE_WIDTH } from '../../Style/StyleSheet';
import Color from "../../constants/Colors";

// const PAGE_WIDTH = Dimensions.get('window').width;
// const PAGE_HEIGHT = Dimensions.get('window').height;

const SIZE = PAGE_WIDTH * 0.7;
const dgl = screenDiagonal();

const Page = (props) => {
    const { index, title, translateX, onPress } = props;

    const inputRange = [(index - 1) * PAGE_WIDTH, index * PAGE_WIDTH, (index + 1) * PAGE_WIDTH]

    const rstyle = useAnimatedStyle(() => {
        const scale = interpolate(
            translateX.value,
            inputRange,
            [0, 1, 0],
            Extrapolate.CLAMP
        )

        const borderRadius = interpolate(
            translateX.value,
            inputRange,
            [0, SIZE / 2, 0],
            Extrapolate.CLAMP
        )

        return {
            transform: [{ scale: scale }],
            // transform: [{ rotate: scale }],
            borderRadius,
        }
    })
    const textStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            translateX.value,
            inputRange,
            [PAGE_HEIGHT / 2, 0, PAGE_HEIGHT / 2],
            Extrapolate.CLAMP
        )
        const opacity = interpolate(
            translateX.value,
            inputRange,
            [-4, 1, -4],
            Extrapolate.CLAMP
        )
        return {
            opacity,
            transform: [{ translateY: scale }],
        }
    })
   
    return (
        <>
        <Animated.View style={[rstyle, Style.square]} />
        <View style={Style.pageContainer}>
            <View style={Style.container2}>
            <Image source={require('../../../assets/icon.png')} style={Style.imageStyle} />
            {/* <Image  source={require('../../../assets/images/agriculture-farm.png')} /> */}
            </View>
            <View> 
            {/* <Animated.View style={[textStyle, Style.container]}> */}
                <Text style={Style.text}>{title?.head}</Text>
                <Text style={Style.text2}>{title?.des}</Text>
                <Text style={Style.text2}>{title?.des2}</Text>
            {/* </Animated.View> */}
            </View>
        </View>

        </>
    )
}

const Dot = (props) => {
    const { data, translateX, style,color } = props;

    return (
        <View>
            <View style={style ? style : { flex: 1, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent', position: 'absolute', bottom: 25, marginLeft: 25 }}>
                {data.map((_, index) => {
                    const inputRange = [(index - 1) * PAGE_WIDTH, index * PAGE_WIDTH, (index + 1) * PAGE_WIDTH]
                    const textStyle = useAnimatedStyle(() => {
                        const size = interpolate(
                            translateX.value,
                            inputRange,
                            [10, 25, 10],
                            Extrapolate.CLAMP)
                        const opacity = interpolate(
                            translateX.value,
                            inputRange,
                            [0.5, 2, 0.5],
                            Extrapolate.CLAMP)
                        return {
                            width: size,
                            opacity,
                            backgroundColor: "yellowgreen"
                        }
                    })
                    return (<Animated.View style={[Style.dot, textStyle]} key={index.toString()} />)
                })}
            </View>
        </View>
    )
}

const Style = StyleSheet.create({
    imageStyle:{
        height:180,
        width: dgl * 40.26,
        alignSelf: 'center', borderRadius: 5, 
        marginBottom:100,
        marginRight:30,
        marginTop:20,
        // resizeMode: 'contain' 
    // width: dgl * 0.26, height: 170, alignSelf: 'center', borderRadius: 5, resizeMode: 'contain' 
    },
    pageContainer: {
    flex: 1, 
    height: PAGE_HEIGHT, width: PAGE_WIDTH, 
    alignItems: 'center', justifyContent: 'center'},
    container: { flex: 2, justifyContent: 'center', alignItems: 'center', position: 'absolute' },
    container2: { flex: 1, top: 200, position: 'absolute' },
    square: {height: SIZE,width: SIZE,
        // backgroundColor: "#000",
        backgroundColor:'#eff',//Color.secondary,
        position: "absolute",
        justifyContent: 'center',
        alignSelf: 'center',
        top: SIZE/1.5,
        left:40},
    text: {
        fontSize: 30,
        color: "#fff",
        textTransform: 'capitalize',
        fontWeight: '700',
        textAlign: "center",
        width: PAGE_WIDTH - 120,
        marginTop:350,
        marginBottom:10,
    },
    text2: {fontSize: 14,color: "#fff",fontWeight: '700',width: PAGE_WIDTH - 120,textAlign: "center"},
    dot: {
        height: 10, 
        margin: 8, 
        marginTop: -30, 
        borderRadius: 10}
})
export { Page, Dot };