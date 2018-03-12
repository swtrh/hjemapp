import React, { Component } from 'react';
import { Button, View, Text, FlatList,  } from 'react-native';
import { StackNavigator, } from 'react-navigation';

let messages = [];
messages.push("test");


import init from 'react_native_mqtt';
import { AsyncStorage } from 'react-native';

init({
    password: "1c8b6586944e43f5",
    username: "c4112519",
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    reconnect: true,
    sync : {
    }
});

const client = new Paho.MQTT.Client('broker.shiftr.io', 80, 'HjemApp');

function onConnect() {
    console.log("onConnect");
    messages.push("Connected!");
    client.subscribe("sb/e1/kjk/#", {});
}


function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
}

function onMessageArrived(message) {
    console.log("onMessageArrived:"+message.payloadString);
    messages.push(message.payloadString);
}

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
client.connect({ onSuccess:onConnect, useSSL: false });


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

class MonitorOneScreen extends Component {

    render() {
        return (
            <Text>{this.props.name}</Text>
        );
    }
}

const monitoring = [
        {key: 'R_G1', name: 'Garasjedør'},
        {key: 'R_T1', name: 'Temperatur inne Reppe'},
        {key: 'S_T1', name: 'Temperatur inne Smibakken', topic: ''},
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
}

const App = StackNavigator({
    Home: { screen: HomeScreen },
    Config: {screen: ConfigScreen},
    MonitorAll:  {screen: MonitorAllScreen},
    MonitorOne: {screen: MonitorOneScreen},
    Messages: {screen: MessageScreen},
});


export default App;
