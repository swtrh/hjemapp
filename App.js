import React, { Component } from 'react';
import { Button, View, Text, FlatList,  } from 'react-native';
import { StackNavigator, } from 'react-navigation';
import { Client, Message } from 'react-native-paho-mqtt';
import { secrets } from './secrets';

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

// Create a client instance
const client = new Client({ uri: 'ws://broker.shiftr.io:80/ws', clientId: 'HjemApp', storage: myStorage });

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
    client.connect({ userName: secrets.username, password: secrets.password})
        .then(() => {
            // Once a connection has been made, make a subscription and send a message.
            console.log('onConnect');
            connected = true;
            messages.push("Connected");
            return client.subscribe("sb/e1/kjk/#");
        })
        .then(() => {
            const message = new Message('Hello');
            message.destinationName = "sb/e1/kjk/x";
            client.send(message);
        })
        .catch((responseObject) => {
            if (responseObject.errorCode !== 0) {
                console.log('onConnectionLost:' + responseObject.errorMessage);
            }
        })
    ;
}

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
        {key: 'S_T1', name: 'Temperatur inne Smibakken'},
        {key: 'S_P1', name: 'Vantrykk Smibakken'},
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
});


export default App;
