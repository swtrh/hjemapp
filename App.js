import React, { Component } from 'react';
import { Button, View, Text, FlatList,  } from 'react-native';
import { StackNavigator, } from 'react-navigation';

let messages = [];
messages.push("test");



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
}

const App = StackNavigator({
    Home: { screen: HomeScreen },
    Config: {screen: ConfigScreen},
    MonitorAll:  {screen: MonitorAllScreen},
    Messages: {screen: MessageScreen},
});


export default App;
