import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';

export default class MovableVideo extends Component {


    constructor(props) {
        super(props); 

        this.state = {
            zIndex: this.props.isFirst ? 1 : 0,
            paused: !this.props.isFirst, // Is this an anti-pattern
        }
    }
    
    bring_to_top = () => {
        this.setState({zIndex: 10}); 
    }
    
    send_to_bottom = () => {
        this.setState({zIndex: 0}); 
    }

    play = () => {
        this.setState({paused: false});
    }

    pause = () => {
        this.setState({paused: true})
    }

    render() {
        return (
            <Video 
                source={this.props.source}
                volume={50} //TODO: work w/ lucas on this
                repeat={true} // maybe this will have to change
                paused={this.state.paused}
                onEnd={this.props.onEnd}
                style={[styles.fsEyes, {zIndex: this.state.zIndex}]}
            />
        ); 
    }
}

const styles = StyleSheet.create({

    fsEyes: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});