import {moderateScale, scale, verticalScale} from 'react-native-size-matters'
 export function hs(size: number){ //horizontal scale
    return scale(size)
}

export function vs(size: number){ //vertical scale
    return verticalScale(size)
}

export function ms(size: number, factor?: number){ // moderate scale
    return moderateScale(size,factor)
}