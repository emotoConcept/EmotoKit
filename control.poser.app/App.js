import React from 'react';
import { StyleSheet, View, Animated, Dimensions, Button, Text } from 'react-native';
import { ScreenOrientation, Circle } from 'expo';
import { createStackNavigator, createAppContainer } from "react-navigation";
import CircularSlider from 'react-native-circular-slider';
import DirectManipulationSlider from './components/DirectManipulationSlider'
// import CircleSlider from './components/CircleSlider';
import AnimationList from './components/AnimationList';
import { range_map } from './util'; 
import TwoAxisBodySlider from './components/TwoAxisBodySlider';
import {Pan} from './components/Pan'; 


class Puppeteer extends React.Component {
  constructor() {
    super();
    this.debug = false;
    this.socket;
    // this.socket = new ReconnectingWebSocket('ws://172.20.10.6:8060')
    // this.socket.addEventListener('open', () => {
    //   this.socket.send('iphone Connec');
    // });
  }


  static navigationOptions = {

    headerStyle: {
      backgroundColor: 'black',
      height: 40,
      elevation: null
    }
  }
  state = {
    value0: 0,
    value1: 0,
    value2: 0,
  };
  componentWillMount() {
    this.socket = this.props.navigation.getParam('socket');
  }
  async componentDidMount() {
    // const { status } = await Permissions.askAsync(Permissions.CAMERA);
    // this.setState({ hasCameraPermission: status === 'granted' });
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.LANDSCAPE);

  }


  _touchX = new Animated.Value(Dimensions.get('window').width / 2 - 30);
  _touchY = new Animated.Value(Dimensions.get('window').height / 2 - 30);

  _onPanGestureEvent = Animated.event([{ nativeEvent: { x: this._touchX } }], { useNativeDriver: true });


  render() {
    var maxValue;
    if (this.debug) {
      maxValue = 690;
    }
    else {
      maxValue = 180;
    }

    const circleRadius = 30;
    return (
      <View style={styles.container}>
       
        <View>
        {/* Pan Component to control phoen rotation */}
        <Pan
          socket={this.socket}
        />
        
          {/* These buttons control the recording of robotic base paired with animation items */}
          <Button
            onPress={() => {
              message = {
                type: 'start Recording',
                name: this.props.navigation.getParam('item') // Pass the name of the sequence we are going to start
              }
              this.socket.send(JSON.stringify(message));
            }}
            title="Start Recording"
            color="#FFFFFF"


          />


          <Button
            onPress={() => {
              message = {
                type: 'playRecording',
                name: this.props.navigation.getParam('item')
              }

              message2 = {type: 'playBodyRecording', name: this.props.navigation.getParam('item')}
              this.socket.send(JSON.stringify(message)); 
              this.socket.send(JSON.stringify(message2));

              

            }}
            title="Play Recording"
            color="#ffffff"
          />
          <Button
            onPress={() => {
              console.log(this.props.navigation.getParam('item') === true)
              message = {
                type: 'saveRecording',
                recordingName: this.props.navigation.getParam('item') != undefined ? this.props.navigation.getParam('item') + '.json' : 'asdf.json'
              }
              this.socket.send(JSON.stringify(message));


            }}
            title="Save Recording"
            color="#ffffff"
          />
        </View>
        <View>
        {/* Two axis slider to control base rotation and arm angle */}
          <TwoAxisBodySlider
            socket={this.socket}
            style={{ zIndex: 400 }}
          />
        </View>

      </View>
    );
  }
}


const AppNavigator = createStackNavigator(
  {
    Home: AnimationList,
    Puppeteer: Puppeteer,
  },
  {
    initialRouteName: 'Home'
  }
);


export default createAppContainer(AppNavigator);





const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
});

var customStyles5 = StyleSheet.create({
  track: {
    height: 18,
    borderRadius: 1,
    backgroundColor: '#d5d8e8',
    // marginBottom: 100,
  },
  thumb: {
    width: 20,
    height: 30,
    borderRadius: 1,
    backgroundColor: '#838486',
  }
});