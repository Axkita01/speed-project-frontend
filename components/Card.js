import {Button, View, StyleSheet, TouchableOpacity, Text} from "react-native"

export default function Card (props) {
    const hex_color = props.color === 'black' ? '#000': '#F00'
    return (
        <View style = {styles.card}>
            <TouchableOpacity
            color = {'#FFF' ? props.color == 'black': '#F00'} 
            onPress = {props.onPress}
            style = {{
                backgroundColor: '#FFF', 
                color: '#000',
                height: '100%',
                width: '100%'
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
        width: '10vw',
        height: '15vw',
        marginRight: '2vw'
    }

})