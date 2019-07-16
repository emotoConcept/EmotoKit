import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import MovableVideo from './MoveableVideo';
import { sequences } from '../assets/sequences'; 
// This class is designed to queue up videos from the sequence
// And display the appropriate video and time the transition to the next
export default class Queue extends Component {

    constructor(props) {
        super(props);
        //test sequence
        //TODO: webview?
        //TODO: subsequence 




        this.refList = [];
        this.willAddSequence = false;
        this.sequenceToAdd = null; 
        this.currIndex = 0;
        this.defaultRef;
        this.state = {
            currSequence: [],
            currDefault: require('../assets/LoopEmotions/normal.mp4'), // Maybe set to blinking?
            // currDefault: require('../assets/.mp4'), 
            isDefault: true, 
        };
    }

    add_sequence = (sequenceName) => {
        if (this.currIndex === 0) {
            this.setState({ currSequence: sequences.find(x => x.name === sequenceName).sequence }); // load sequence into state
        }
    }

    //Depricated function for testing. 
    play_next = () => {

        if (this.state.indexOne === 1) {
            this.setState({ indexTwo: 1, indexOne: 0, blinkPaused: true, surpPaused: false });

        }
        else {

            this.setState({ indexTwo: 0, indexOne: 1, blinkPaused: false, surpPaused: true });
        }
    }

    play_default = (newDefault) => {
        this.currIndex = 0;

        if (newDefault != undefined) {
            this.setState({ currSequence: [], currDefault: newDefault });
        }

        else {
            this.setState({ currSequence: [] });
        }
        this.defaultRef.play(); 
        this.defaultRef.bring_to_top();

    }
    //this function will modify the videos using the reflist. 
    play_next_stack = () => {
        var videoToTop;
        var videoToBottomAndPause;
        //if our currVideo Playing is the last in the reflist, put default in
        if (this.currIndex === this.refList.length - 1) {
            this.props.socket.send(JSON.stringify('sendSignalToStop')); 
            //if this video is to become the new default, pass it to the play_default
            if (this.state.currSequence[this.currIndex].newDefault === true) {
                this.play_default(this.state.currSequence[this.currIndex].anim);
            }
            else {
                this.play_default();
            }
        }
        //otherwise incremment the video 
        else {
            videoToBottomAndPause = this.refList[this.currIndex];
            videoToTop = this.refList[this.currIndex + 1];

            videoToBottomAndPause.pause();
            videoToBottomAndPause.send_to_bottom();

            videoToTop.play();
            videoToTop.bring_to_top();
            this.currIndex++;
        }

    }
    default = () => {
        return (
            <MovableVideo
                source={this.state.currDefault}
                isFirst={true}
                ref={(def) => this.defaultRef = def}
                onEnd={() => {}}
                onProgress={(currentTime, playableDuration, seekableDuration) => {
                    console.log(currentTime, this.willAddSequence, this.sequenceToAdd); 
                    if (this.willAddSequence && (playableDuration - currentTime) < 0.25) {
                        this.add_sequence(this.sequenceToAdd); 
                    }
                }}
            />
        );
    }
    play_queue = () => {
        if (this.state.currSequence.length === 0) {
            return null;
        }

        else {
            this.refList = [];
            this.defaultRef.send_to_bottom(); 
            this.defaultRef.pause(); 
            return (
                this.state.currSequence.map((animElement, index, arr) => {

                    var isFirst = false;
                    var isPaused = true;
                    // If its the first element in the array we want to give its z index on top, NOTE: Maybe playing == true                   
                    if (index === 0) {
                        isFirst = true;
                        isPaused = false;
                    }
                    return (
                        <MovableVideo
                            source={animElement.anim}
                            isFirst={isFirst}
                            ref={(vid) => this.refList.push(vid)}
                            onEnd={this.play_next_stack}
                            key={index}
                        />
                    );
                })

            );

        }
    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => {
                    // this.add_sequence('recognitionSequence');
                    this.willAddSequence = true;
                    this.sequenceToAdd = ('recognitionSequence'); 
                }}>

                    <View style={{ flex: 1 }}>
                        {this.play_queue()}
                        {this.default()}
                    </View>
                </TouchableWithoutFeedback>


            </View>


        );
    }

}

const testSequence = [{ anim: './assets/blink.mp4', movement: {}, looping: 2 },
{ anim: './assets/surp_text.mp4', movement: {} }]

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    fsEyes: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});