import React, { Component } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { range_map } from '../util';
import {
    PanGestureHandler,
    ScrollView,
    State,
} from 'react-native-gesture-handler';
import { UrlTile } from 'react-native-maps';


export default class BodyBall extends Component {
    constructor(props) {
        super(props);
        this._translateX = new Animated.Value(0);
        this._translateY = new Animated.Value(0);
        this._lastOffset = { x: 0, y: 0 };


        this._onGestureEvent = (event => {


            // console.log('X: ' + event.nativeEvent.absoluteX, 'Y: ' + event.nativeEvent.absoluteY);

            //   x range 63 - 330
            // y range 273  - 755
            // TODO: MAKE THIS LESS JANK1!! 
            if (event.nativeEvent.absoluteY > 63 && event.nativeEvent.absoluteY < 330 &&
                event.nativeEvent.absoluteX > 416 && event.nativeEvent.absoluteX < 696) {
                this._translateX.setValue(event.nativeEvent.translationX);
                this._translateY.setValue(event.nativeEvent.translationY);

                var baseAngle = range_map(event.nativeEvent.absoluteX, 416, 696, 0, 180);
                var armAngle = range_map(event.nativeEvent.absoluteY, 63, 330, 0, 180);
                message = {
                    type: 'position',
                    angles: [{ motor: 1, value: armAngle }, { motor: 0, value: baseAngle }]
                };

                this.props.socket.send(JSON.stringify(message));




            }
        });


    }
    _onHandlerStateChange = event => {
        
        if (event.nativeEvent.oldState === State.ACTIVE) {
            this._lastOffset.x += event.nativeEvent.translationX;
            this._lastOffset.y += event.nativeEvent.translationY;
            this._translateX.setOffset(this._lastOffset.x);
            this._translateX.setValue(0);
            this._translateY.setOffset(this._lastOffset.y);
            this._translateY.setValue(0);
        }
    };
    render() {
        return (
            <PanGestureHandler
                {...this.props}
                onGestureEvent={this._onGestureEvent}
                onHandlerStateChange={this._onHandlerStateChange}>
                <Animated.View
                    style={[
                        styles.box,
                        {
                            transform: [
                                { translateX: this._translateX },
                                { translateY: this._translateY },
                            ],
                        },

                        this.props.boxStyle,
                    ]}
                />
            </PanGestureHandler>
        );
    }
}


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    box: {
        width: 80,
        height: 80,

        backgroundColor: '#69FFB7',
        borderRadius: 20,

        zIndex: 200,
    },
});
