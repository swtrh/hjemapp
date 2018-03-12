import React, { Component } from 'react';
import { Button, View, Text } from 'react-native';
import { StackNavigator, } from 'react-navigation';

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

class MonitorAllScreen extends Component {
    static navigationOptions = {
        title: 'Alle alarmer',
    };
    render() {
        return (
            <View>
                <MonitorOne name='Garasjedør' />
                <MonitorOne name='Temperatur inne Reppe' />
                <MonitorOne name='Vanntrykk Smibakken' />
                <MonitorOne name='Temperatur Smibakken' />
            </View>
        );
    }
}

const App = StackNavigator({
    Home: { screen: HomeScreen },
    Config: {screen: ConfigScreen},
    MonitorAll:  {screen: MonitorAllScreen},
});

export default App;
