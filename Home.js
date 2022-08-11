import {
        View, StyleSheet, TextInput, Text
        } from 'react-native-web'
import {useState} from 'react'
import {io} from 'socket.io-client'
import Fancy from './components/Fancy'
import {useFonts} from 'expo-font'
import Deck from './components/Deck'



export default function Home({navigation}) {
    const [textInput, setTextInput] = useState('')
    let [fonts] = useFonts({
        'KdamThmorPro': require('./assets/fonts/KdamThmorPro-Regular.ttf'),
        'Karla': require('./assets/fonts/Karla-VariableFont_wght.ttf')
    })
    return (
        <View style = {styles.container}>
            <Text style = {styles.header}>Welcome to Speed!</Text>

            <Fancy text = 'Rules' onPress = {() => {navigation.navigate('rules')}}/>
            
            <Fancy
            text = 'Create Room'
            onPress={() => {
            /*temporary server link*/
            const socket = io('https://speed-project-server.herokuapp.com');
            const r = Math.floor(Math.random() * 10).toString();
            socket.emit('create_room', r)
            navigation.navigate('game', {s: socket, room: r})}}
          />
          
        <View style = {styles.textInContain}>
            <Text style = {styles.textInHeader}>Enter Room Number to Join (Enter to Submit):</Text>
            <TextInput
            placeholder = 'Enter Room Number'
            style = {styles.textIn}
            onChangeText = {setTextInput}
            value = {textInput}
            onSubmitEditing = {() => {
                /*Add Error Handling*/
                let s = io('https://speed-project-server.herokuapp.com');
                const r = textInput;
                navigation.navigate('game', {s: s, room: r});
            }}
            />
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
    textInContain: {
        width: '80%',
        height: '10%',
        marginTop: '3vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },

    textIn: {
        width: '50%',
        height: '90%',
        borderStyle: 'solid',
        borderColor: 'white',
        borderWidth: '.1vw',
        color: 'white'
    },

    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#555555', 
        marginTop: '3%'
    },

    header: {
        fontSize: '100%',
        fontWeight: 'bold',
        marginBottom: '2%',
        color: 'white',
        fontFamily: 'Kdam Thmor Pro'
    },

    textInHeader: {
        fontSize: '90%', 
        marginRight: '1%',
        color: 'white',
        marginBottom: '1vh',
        fontFamily: 'Karla'
    }
  
    }

)