import React from 'react';
import { Slider, StyleSheet } from 'react-native';


// A slider for manipulating Emoto's motors directly
// TODO: Depricated, not used. 
export default class DirectManipulationSlider extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Slider
                maximumValue={this.props.maxVal}
                minimumValue={this.props.minVal}
                step={1}
                trackStyle={customStyles5.track}
                thumbStyle={customStyles5.thumb}
                style={{ marginBottom: 50 }}
                value={0}
                onValueChange={value => {
                    message = {
                        type: 'position',
                        angles: [{ motor: this.props.motor, value: value }]
                    }; 

                    this.props.socket.send(JSON.stringify(message)); 
                }}
            />
        );
    }


}

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