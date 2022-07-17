import {StyleSheet, Button} from "react-native"

export default function Card (props) {
    return (
            <Button
            color = '#fff' 
            onClick = {() => {props.socket.emit('card', props.number)}}
            style = {styles.container}
            title = {props.color + ' ' + props.number}
            />
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      color: '#fff',
      borderStyle: 'solid',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });