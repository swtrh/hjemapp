import {Client, Message} from "react-native-paho-mqtt";
import {secrets} from "./secrets";

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
    console.log(JSON.stringify(message) + ': ' + message.payloadString);
    messages.push({topic: message._destinationName, value: message.payloadString});
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

export {conn, client, messages};
