import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Video } from 'expo';
import BodyBall from './BodyBall';

export default class TwoAxisBodySlider extends React.Component {
    constructor(props) {
        super(props);
        this.bgTest = require('../assets/OpeningLookingDown.mp4'); 
    }

    render() {
        return (

            // TODO: ADD VIDEO BACKGOURND (0.1 BEHIND) 
            <View style={{ flex: 1 }}>
                <View style={{
                    backgroundColor: 'gray', zIndex: -5, width: 300, height: 300, justifyContent: 'center',
                    alignItems: 'center'
                }}>


                <BodyBall style={{ zIndex: 4 }} socket={this.props.socket} />

                </View>
            </View>
        );
    }
}