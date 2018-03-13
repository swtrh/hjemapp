import React, { Component } from 'react';
import { Button, View, Text, FlatList, TextInput, } from 'react-native';
import { StackNavigator, } from 'react-navigation';
import { Client, Message } from 'react-native-paho-mqtt';
import { secrets } from './secrets';


const testTopic = "sb/e1/kjk/x";
const testSubscribeTopic = "sb/e1/kjk/#";
const testHost = "ws://broker.shiftr.io:80/ws";

let messages = [];
let connected = false;

//Set up an in-memory alternative to global localStorage
const myStorage = {
    setItem: (key, item) => {
        myStorage[key] = item;
    },
    getItem: (key) => myStorage[key],
    removeItem: (key) => {
        delete myStorage[key];
    },
};

// Create a mqtt client instance
const client = new Client({ uri: testHost, clientId: 'HjemApp', storage: myStorage });

// set event handlers
client.on('connectionLost', (responseObject) => {
    if (responseObject.errorCode !== 0) {
        connected = false;
        messages.push("Lost conn");
        console.log(responseObject.errorMessage);
    }
});

client.on('messageReceived', (message) => {
    console.log(message.payloadString);
    messages.push(message.payloadString);
});

function conn() {
    if (!connected) {
        client.connect({ userName: secrets.username, password: secrets.password})
            .then(() => {
                // Once a connection has been made, make a subscription and send a message.
                console.log('onConnect');
                connected = true;
                messages.push("Connected");
                return client.subscribe(testSubscribeTopic);
            })
            .then(() => {
                const message = new Message('Hello');
                message.destinationName = testTopic;
                client.send(message);
            })
            .catch((responseObject) => {
                if (responseObject.errorCode !== 0) {
                    console.log('onConnectionLost:' + responseObject.errorMessage);
                }
            })
        ;
    }
}

//Initial connection to message queue
conn();

class HomeScreen extends Component {
    static navigationOptions = {
        title: 'HjemApp',
    };
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View>
                <Button
                    title="Konfigurer"
                    onPress={() =>
                        navigate('Config')
                    }
                />
                <Button
                    title="Alle alarmer"
                    onPress={() =>
                        navigate('MonitorAll')
                    }
                />
                <Button
                    title="Kringkast melding"
                    onPress={() =>
                        navigate('Broadcast')
                    }
                />
                <Button
                    title="Alle meldinger"
                    onPress={() =>
                        navigate('Messages')
                    }
                />
            </View>
        );
    }
}

class ConfigScreen extends Component {
    static navigationOptions = {
        title: 'Konfigurer HjemApp',
    };
    render() {
        return (
            <View>
                <Text>Konfig her!</Text>
            </View>
        );
    }
}

class MonitorOne extends Component {
    render() {
        return (
            <Text>{this.props.name}</Text>
        );
    };
}

const monitoring = [
        {key: 'R_G1', name: 'Garasjedør'},
        {key: 'R_T1', name: 'Temperatur inne Reppe'},
        {key: 'S_T1', name: 'Temperatur inne Smibakken', topic: 'sb/e1/kjk/t', high: 30.0, low: 5.0},
        {key: 'S_P1', name: 'Vanntrykk Smibakken'},
    ];

class MonitorAllScreen extends Component {
    static navigationOptions = {
        title: 'Alle alarmer',
    };
    render() {
        return (
            <View>
                <Text>Alle alarmer</Text>
                <FlatList
                    let data={monitoring}
                    renderItem={({item}) => <Text>{item.name}</Text>}
                />
            </View>
        );
    };
}

class MessageScreen extends Component {
    static navigationOptions = {
        title: 'Alle meldinger',
    };
    render() {
        return (
            <View>
                <Text>Alle meldinger</Text>
                <FlatList
                    let data={messages}
                    renderItem={({item}) => <Text>{item}</Text>}
                />
            </View>
        );
    };

    componentDidMount() {
        conn();
    }
}

class BroadcastScreen extends Component {
    static navigationOptions = {
        title: 'Kringkast melding',
    };

    constructor(props) {
        super(props);
        this.state = { text: '<Skriv noe her>' };
    }

    render() {
        return (
            <View>
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => {
                        this.setState({text});
                    }}
                    value={this.state.text}
                />
                <Button
                    title="Send melding"
                    onPress={ () => {
                            const message = new Message(this.state.text);
                            message.destinationName = testTopic;
                            client.send(message);
                        }
                    }
                />
            </View>
        );
    }

    componentDidMount() {
        if (!connected) {
            conn();
        }
    }
}

const App = StackNavigator({
    Home: { screen: HomeScreen },
    Config: {screen: ConfigScreen},
    MonitorAll:  {screen: MonitorAllScreen},
    Messages: {screen: MessageScreen},
    Broadcast: {screen: BroadcastScreen},
});


export default App;
