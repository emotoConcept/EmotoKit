import React, { Component } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import {
    PanGestureHandler,
    TapGestureHandler,
    ScrollView,
    State,
} from 'react-native-gesture-handler';
import { range_map } from '../util';

// import { USE_NATIVE_DRIVER } from '../config';
// import { LoremIpsum } from '../common';

const windowWidth = Dimensions.get('window').width;
const circleRadius = 30;

export class Pan extends Component {
    constructor(props) {
        super(props);
        this._touchX = new Animated.Value(windowWidth / 2 - circleRadius);
        this._translateX = Animated.add(
            this._touchX,
            new Animated.Value(-circleRadius)
        );
        this._onPanGestureEvent = (event) => {
            // console.log(event.nativeEvent.x);
            var snappedVal; 
            var phoneAngle
            // if (event.nativeEvent.absoluteX < 122 && event.nativeEvent.absoluteX > 118) {
            //     console.log('snapping'); 
            //     snappedVal = 119; 
            //     phoneAngle = range_map(snappedVal, 50, 175,
            //         0, 180);
            // }
            // else {
                phoneAngle = range_map(event.nativeEvent.absoluteX, 120, 352,
                    0, 180);
            // }
            this._touchX.setValue(event.nativeEvent.x);
            // this._touchX.setValue(snappedVal); 
            // var phoneAngle = range_map(event.nativeEvent.absoluteX, 50, 175,
                // 0, 180);

            message = {
                type: 'position',
                angles: [{ motor: 2, value: phoneAngle }]
            };

            this.props.socket.send(JSON.stringify(message)); 
        };
        // this._onPanGestureEvent = Animated.event(
        //     [
        //         {
        //             nativeEvent: {
        //                 x: this._touchX,
        //             },
        //         },
        //     ],

        // );

        _onTapHandlerStateChange = ({ nativeEvent }) => {
            if (nativeEvent.oldState === State.ACTIVE) {
                // Once tap happened we set the position of the circle under the tapped spot
                
                this._touchX.setValue(nativeEvent.x);
            }
        };
    }
    render() {
        const { tapRef, panRef } = this.props;
        return (
            <TapGestureHandler
                ref={tapRef}
                waitFor={panRef}
                onHandlerStateChange={this._onTapHandlerStateChange}
                shouldCancelWhenOutside>
                <Animated.View style={styles.wrapper}>
                    <PanGestureHandler
                        ref={panRef}
                        activeOffsetX={[-20, 20]}
                        onGestureEvent={this._onPanGestureEvent}
                        shouldCancelWhenOutside>
                        <Animated.View style={styles.horizontalPan}>
                            <Animated.View
                                style={[
                                    styles.circle,
                                    {
                                        transform: [
                                            {
                                                translateX: this._translateX,
                                            },
                                        ],
                                    },
                                ]}
                            />
                        </Animated.View>
                    </PanGestureHandler>
                </Animated.View>
            </TapGestureHandler>
        );
    }
}


const styles = StyleSheet.create({
    horizontalPan: {
        backgroundColor: '#f48fb1',
        height: 150,
        width: 300,
        justifyContent: 'center',
        marginVertical: 10,
    },
    circle: {
        backgroundColor: '#42a5f5',
        borderRadius: circleRadius,
        height: circleRadius * 2,
        width: circleRadius * 2,
    },
    wrapper: {
        flex: 1,
    },
});