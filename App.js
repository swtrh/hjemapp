import React, { Component } from 'react';
import { Button, View } from 'react-native';
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
                />
            </View>
        );
    }
}

const App = StackNavigator({
    Home: { screen: HomeScreen },
});

export default App;