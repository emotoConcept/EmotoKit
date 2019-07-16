import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenOrientation } from 'expo';
import ReconnectingWebSocket from 'reconnecting-websocket';


// This class displays an array thats constantly updating/ fetching stuff from the other iPhone app
// Including a lsit of avalialbe sequences to animate.
export default class AnimationList extends React.Component {
    constructor(props) {
        super(props);
        
        //REPLACE THIS WITH YOUR PI'S ip! 
        this.RASPBERRY_PI_IP = '172.20.10.12'

        this.socket = new ReconnectingWebSocket('ws://' + this.RASPBERRY_PI_IP + ':8065');

        this.state = {
            sequenceList: null
        }


        this.socket.addEventListener('open', () => {
            this.socket.send(JSON.stringify('getSequences')); 
        })
        this.socket.addEventListener('message', (event) => {
            var recMessage = JSON.parse(event.data); 
            
            if (recMessage.type === 'sequenceList') {
                listData = []; 
                recMessage.seqList.forEach(element => {
                    listData.push({key: element})
                })
                this.setState({sequenceList: listData})
            }

            if (recMessage === 'sendSignalToStopToController') {
                this.socket.send(JSON.stringify('stopRecording')); 
            }
        }); 

    }

    componentDidMount() {
        ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT);

    }

    static navigationOptions = {
        headerTitle: <Text>Sequence List</Text>

    };

    render() {
        return (
            <View>
                <FlatList
                    data={this.state.sequenceList}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress= {() => this.props.navigation.navigate('Puppeteer', {item: item.key, socket: this.socket})}>
                                
                                <Text style={styles.item}>{item.key}</Text>
                            </TouchableOpacity>
                        );
                    }}
                    refreshing={false}
                    onRefresh = {() => {
                        this.socket.send(JSON.stringify('getSequences'))
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
})