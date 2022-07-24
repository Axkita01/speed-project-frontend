import {Button, View, StyleSheet, TouchableOpacity, Text} from "react-native"

export default function Card (props) {
    const hex_color = props.color === 'black' ? '#000': '#F00'
    return (
        <View style = {styles.card}>
            <TouchableOpacity
            color = {'#FFF' ? props.color == 'black': '#F00'} 
            onPress = {props.onPress}
            style = {{
                height: '100%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            >
                <Text 
                    style = {{color: hex_color, fontWeight: 'bold', fontSize: '5vw'}}>
                    {props.number}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderStyle: 'solid',
        borderWidth: '.2vw',
        borderRadius: '2vw',
        width: '20vw',
        height: '30vw',
        marginRight: '2vw',
        marginBottom: '1vw'
    }


})