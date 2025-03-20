// Configuración de MQTT con WebSockets
const broker = 'wss://broker.emqx.io:8084/mqtt'; // URL de WebSocket seguro
const topic = 'sensor/soilMoisture'; // Tópico MQTT

// Crear un cliente MQTT
const client = new Paho.MQTT.Client("broker.emqx.io", 8084, "/mqtt");

// Función de conexión
client.connect({
    onSuccess: onConnect,
    onFailure: onFailure,
    useSSL: true
});

// Función que se ejecuta al conectar
function onConnect() {
    console.log('✅ Conectado al broker MQTT');
    client.subscribe(topic, {
        onSuccess: onSubscribe,
        onFailure: onSubscribeFailure
    });
}

// Función que se ejecuta al fallar la conexión
function onFailure(response) {
    console.error('❌ Fallo al conectar al broker MQTT:', response.errorMessage);
}

// Función que se ejecuta al suscribirse
function onSubscribe() {
    console.log('✅ Suscrito al tópico:', topic);
}

// Función que se ejecuta al fallar la suscripción
function onSubscribeFailure(response) {
    console.error('❌ Fallo al suscribirse al tópico:', response.errorMessage);
}

// Función que se ejecuta al recibir un mensaje
client.onMessageArrived = function (message) {
    console.log('📩 Mensaje recibido:', message.payloadString);
    document.getElementById('soil-moisture').innerText = message.payloadString;
};

// Función que se ejecuta al desconectar
client.onConnectionLost = function (responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log('⚠️ Desconexión de MQTT:', responseObject.errorMessage);
    }
};
