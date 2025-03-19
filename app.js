// Configuración de MQTT
const broker = 'test.mosquitto.org'; // Broker MQTT
const port = 8883; // Puerto para conexión segura MQTT
const topic = 'sensor/soilMoisture'; // Cambia esto al tópico que estés usando

// Crear un cliente MQTT
const client = new Paho.MQTT.Client(broker, port, 'webClient');

// Función de conexión
client.connect({
    onSuccess: onConnect,
    onFailure: onFailure,
    useSSL: true,
});

// Función que se ejecuta al conectar
function onConnect() {
    console.log('Conectado al broker MQTT');
    client.subscribe(topic, { onSuccess: onSubscribe, onFailure: onSubscribeFailure });
}

// Función que se ejecuta al fallar la conexión
function onFailure(response) {
    console.error('Fallo al conectar al broker MQTT:', response.errorMessage);
}

// Función que se ejecuta al suscribirse
function onSubscribe() {
    console.log('Suscrito al tópico:', topic);
}

// Función que se ejecuta al fallar la suscripción
function onSubscribeFailure(response) {
    console.error('Fallo al suscribirse al tópico:', response.errorMessage);
}

// Función que se ejecuta al recibir un mensaje
client.onMessageArrived = function(message) {
    console.log('Mensaje recibido:', message.payloadString);
    document.getElementById('soil-moisture').innerText = message.payloadString;
};

// Función que se ejecuta al desconectar
client.onConnectionLost = function(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log('Desconexión de MQTT:', responseObject.errorMessage);
    }
};
