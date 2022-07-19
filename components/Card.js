import {Button, View, StyleSheet, TouchableOpacity, Text} from "react-native"

export default function Card (props) {
    const hex_color = props.color === 'black' ? '#000': '#F00'
    return (
        <View style = {styles.card}>
            <TouchableOpacity
            color = {'#FFF' ? props.color == 'black': '#FFF'} 
            onPress = {() => {props.socket.emit('card', props.number)}}
            style = {{
                backgroundColor: '#FFF', 
                color: hex_color,
                height: '12vh',
                width: '7vw'
            }}
            >
                <Text>{props.color + ' ' + props.number}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderStyle: 'solid',
        borderWidth: '.2vw',
    }

})