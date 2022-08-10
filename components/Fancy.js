import { Animated, Text, Pressable } from 'react-native-web';
import {StyleSheet} from 'react-native-web'
import {useState, useEffect} from 'react'
import {useFonts} from 'expo-font'

export default function Fancy(props) {
    const [pressed, changePressed] = useState(false)
    const [scale] = useState(new Animated.Value(1))
    const [shadowVal] = useState(new Animated.Value(0))

    let [fonts] = useFonts({
        'KdamThmorPro': require('../assets/fonts/KdamThmorPro-Regular.ttf'),
        'Karla': require('../assets/fonts/Karla-VariableFont_wght.ttf')
    })

    useEffect( function () {
        Animated.parallel([
            /*FIXME: Add shadow animation to button*/
            Animated.timing(shadowVal, {
                toValue: pressed ? 0: 0,
                duration: 1,
                useNativeDriver: true
            }),

            Animated.timing(scale, {
                toValue: pressed ? .98: 1,
                duation: 1,
                useNativeDriver: true
            })
        ]).start()
    }, [pressed])

    return (
        <Animated.View style = {styles(scale, shadowVal).buttonContain}>
        <Pressable
            onPressIn = {() => {changePressed(true)}}
            onPressOut = {() => {changePressed(false)}}
            onPress={props.onPress}
            style={styles(scale, shadowVal).button}>
            <Text style={styles(scale, shadowVal).buttonText}>{props.text}</Text>
        </Pressable>
        </Animated.View>
    );
}

const styles =  (scale, shadowVal) => StyleSheet.create({
    button: 
        {   
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            borderStyle: 'solid',
            borderColor: 'white',
            backgroundColor: '#56C7FF',
            borderRadius: '5px',
            borderWidth: '.1vw',
            shadowColor: 'white',
            shadowRadius: '0',
            shadowOffset: {width: shadowVal, height: shadowVal}
        },

    buttonText: {
        fontSize: '70%',
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'Karla'
    },

    buttonContain: {
        width: '30%',
        height: '20%',
        marginBottom: '3vh',
        marginTop: '1%',
        scale: scale
    }
    
})