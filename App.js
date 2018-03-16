import React, { Component } from 'react';
import { Button, View, Text, FlatList, TextInput, } from 'react-native';
import { StackNavigator, } from 'react-navigation';
import { Message } from 'react-native-paho-mqtt';
import {client, conn, messages} from "./events";

const testTopic = "sb/e1/kjk/x";

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
                <Button
                    title="En måling"
                    onPress={() =>
                        navigate('MonitorOne', {tag: 'S_T1'})
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
    static navigationOptions = {
        title: 'En måling',
    };


    render() {
        return (
            <View>
                <Text>Tag: {this.props.navigation.state.params.tag} </Text>
            </View>
        );
    };
}

const monitoring = [
        {key: 'R_G1', name: 'Garasjedør', topic: 'rp/h2/door', type: 'openclosed'},
        {key: 'R_T1', name: 'Temperatur inne Reppe'},
        {key: 'S_T1', name: 'Temperatur inne Smibakken', topic: 'sb/e1/kjk/t', type:'contin', high: 30.0, low: 5.0},
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
        conn();
    }
}

const App = StackNavigator({
    Home: { screen: HomeScreen },
    Config: {screen: ConfigScreen},
    MonitorAll:  {screen: MonitorAllScreen},
    Messages: {screen: MessageScreen},
    Broadcast: {screen: BroadcastScreen},
    MonitorOne:  {screen: MonitorOneScreen}, //( {tag: 'S_T1'} )
});


export default App;
