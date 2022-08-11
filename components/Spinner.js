import {Animated, StyleSheet} from 'react-native-web'
import {useState, useEffect} from 'react'

export default function Spinner() {
    const [opacity] = useState(new Animated.Value(.5))
    const [scale] = useState(new Animated.Value(1.7))
    useEffect( () =>  {
        Animated.loop(
        Animated.sequence([
        Animated.parallel([
            Animated.timing(opacity,
                {
                toValue: 0,
                duration: 2000,
                useNativeDriver: true,
                }),

            Animated.timing(scale, {
                toValue: .9,
                duration: 2000,
                useNativeDriver: true,
            })
            ]), Animated.delay(200)])).start()
        }, []) 


    return (
    <Animated.View style = {styles(scale, opacity).spinner}>
        <Animated.View style = {styles(scale, opacity).innerSpinner}>
            <Animated.View style = {styles(scale, opacity).innerInnerSpinner}/>
        </Animated.View>
    </Animated.View>
    )
}

const styles = (scale, opacity) => StyleSheet.create({
    spinner: {
        display: 'flex',
        alignItems: 'center',
        width: '7vh',
        height: '7vh',
        opacity: opacity,
        borderRadius: '5vh',
        backgroundColor: 'white',
        scale: scale,
        marginBottom: '4vh'
    },

    innerSpinner: {
        display: 'flex',
        alignItems: 'center',
        width: '5vh',
        height: '5vh',
        marginTop: '1vh',
        opacity: opacity,
        borderRadius: '2.5vh',
        backgroundColor: '#56C7FF'
    },

    innerInnerSpinner: {
        width: '3vh',
        height: '3vh',
        marginTop: '1vh',
        opacity: opacity,
        borderRadius: '1.5vh',
        backgroundColor: 'white'
    }
})