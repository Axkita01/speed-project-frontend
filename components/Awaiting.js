import {View, StyleSheet, Text} from 'react-native-web'
import Spinner from './Spinner'
import {useFonts} from 'expo-font'

export default function Awaiting (props) {
    /*props are room*/
    let [fonts] = useFonts({
        'KdamThmorPro': require('../assets/fonts/KdamThmorPro-Regular.ttf'),
        'Karla': require('../assets/fonts/Karla-VariableFont_wght.ttf')
    })
    return(
    <View style = {styles.container}>
        <Spinner/>
        <Text style = {styles.awaitingText}>Awaiting Player Connection {'(Room ' + props.room + ')'}...</Text>
    </View>
    )
}

const styles = StyleSheet.create({
    awaitingText: {
        color: 'white',
        fontFamily: 'Karla',
        fontSize: '2vh'
    },

    container: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: '30vh'
    },
})