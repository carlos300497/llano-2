// Configuración de MQTT
const broker = 'io.adafruit.com';
const port = 443; // Puerto para conexión segura MQTT
const username = 'carlos97M'; // Reemplaza con tu nombre de usuario de Adafruit IO
const aioKey = 'aio_bjDy87R1fy2USxOIgCxqh91gUqtp'; // Reemplaza con tu clave de Adafruit IO
const topic = `${username}/feeds/Humedad`; // Cambia esto al feed que estés usando

// Crear un cliente MQTT
const client = new Paho.MQTT.Client(broker, port, 'webClient');

// Función de conexión
client.connect({
    userName: username,
    password: aioKey,
    onSuccess: onConnect,
    useSSL: true,
});

// Función que se ejecuta al conectar
function onConnect() {
    console.log('Conectado al broker MQTT');
    client.subscribe(topic);
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
