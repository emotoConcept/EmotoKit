/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Button, View, Image} from 'react-native';
import Video from 'react-native-video';
import Queue from './components/Queue';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { sequences } from './assets/sequences'; 
import PrefersHomeIndicatorAutoHidden from 'react-native-home-indicator';



const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);


    this.RASPBERRY_PI_IP = '192.168.1.177'





    console.disableYellowBox = true;
    this.socket = new ReconnectingWebSocket('ws://' + this.RASPBERRY_PI_IP + ':8065'); 
    // this.socket = new ReconnectingWebSocket('ws://10.0.0.112:8065'); 
    this.queueRef = null; 
    this.socket.addEventListener('message', (event) => {
      var recMessage = JSON.parse(event.data);
      console.log(recMessage); 
      if (recMessage === 'retrieveSequences') {
        
        sequenceListMessage = []
        sequences.forEach(element => {
          sequenceListMessage.push(element.name); 
        });
        var message = {
          type: 'sequenceList',
          seqList: sequenceListMessage
        }; 
        console.log(message);
        this.socket.send(JSON.stringify(message)); 
      }

      else if (recMessage.type === 'startRecording') {
        this.queueRef.add_sequence(recMessage.name); 
      }

      else if (recMessage.type === 'playRecording') {
        console.log('playingRecording'); 
        this.queueRef.add_sequence(recMessage.name); 
      }
  });
  // ScreenOrientation.allowAsync(ScreenOrientation.Orientation.LANDSCAPE);
  

}

  state = {
    myIndex: 0,
  }



  render() {

    return (
      <View style={styles.container}>
                <PrefersHomeIndicatorAutoHidden />

        <Queue
          ref={(myre) => this.queueRef = myre}
          socket = {this.socket}
        />        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  myButton: {
    zIndex: 4,
  },

  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1
  },
});
