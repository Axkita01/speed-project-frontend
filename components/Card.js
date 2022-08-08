import {Animated, View, StyleSheet, TouchableOpacity, Text} from "react-native-web"
import {useEffect, useState} from 'react'

export default function Card (props) {
    const hex_color = props.color === 'black' ? '#000': '#F00'
    const [animatedScale] = useState(new Animated.Value(1))
    const [animatedShadow] = useState(new Animated.Value(0))
    /*selection animation*/
    useEffect(() => {
        Animated.parallel([
            Animated.timing(animatedScale, {
                toValue: (props.selected) ? 1.2: 1,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(animatedShadow, {
                toValue: props.selected ? 4: 0,
                duration: 200,
                useNativeDriver: true
            })
        ], {stopTogether: false}).start()
    }, [props.selected])

    return (
        <Animated.View style = {styles(animatedScale, animatedShadow, props.selected).card}>
            <TouchableOpacity
            color = {'#FFF' ? props.color == 'black': '#F00'} 
            onPress = {props.onPress}
            style = {{
                height: '100%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#BBBBBB',
                borderRadius: '1vh',
                borderStyle: 'solid',
                borderWidth: '.1vw'
            }}
            >
                <Text 
                    style = {{color: hex_color, fontWeight: 'bold', fontSize: '2.5vh'}}>
                    {props.number}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    )
}

const styles = (animatedScale, animatedShadow, selected) => StyleSheet.create({
    card: {
        width: '8vh',
        height: '12vh',
        borderRadius: '1vh',
        marginRight: !selected ? '1.5vw': '2.5vw',
        marginLeft: !selected ? '1.5vw': '2.5vw',
        scale: animatedScale,
        shadowColor: 'black',
        shadowOffset: {width: animatedShadow, height: animatedShadow}, 
    }
})
