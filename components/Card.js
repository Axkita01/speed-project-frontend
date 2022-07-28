import {Button, View, StyleSheet, TouchableOpacity, Text} from "react-native-web"

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
                background: '#AAAAAA',
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
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '8vh',
        height: '12vh',
        marginRight: '1vh',
        marginBottom: '.5vh',
    }
})