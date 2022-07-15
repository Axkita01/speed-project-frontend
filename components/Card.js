import { StyleSheet } from "react-native"

export default function Card (props) {
    return (
        <div>
            <button onClick = {() => {props.socket.emit('card', props.number)}}>
                {props.number}<br/>
                {props.suit}<br/>
                {props.color}<br/>
            </button>
        </div>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      borderStyle: 'solid',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });