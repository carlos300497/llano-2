// Configuración del broker MQTT con WebSockets
const broker = 'wss://broker.emqx.io:8084/mqtt'; // Broker MQTT con WebSockets seguros
const topics = ['sensor/temperatura/tablero', 'sensor/humedad/arandano', 'sensor/temperatura/rasberry']; // Lista de tópicos a suscribir

// Crear cliente MQTT
const client = new Paho.Client(broker, "clientId-" + Math.floor(Math.random() * 10000));

// Historial de humedad del arándano (máximo 30 registros)
let humedadData = [];
let humedadLabels = [];

// Configuración del gráfico de humedad del arándano
const ctx = document.getElementById('humedadArandanoChar').getContext('2d');
const humedadArandanoChar = new Chart(ctx, {
    type: 'line', // Cambio a línea para mejor visualización de tendencia
    data: {
        labels: [],
        datasets: [{
            label: 'Humedad (%)',
            data: [],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.3)',
            borderWidth: 2,
            tension: 0.3, // Suaviza la curva de la línea
            pointRadius: 3 // Tamaño de los puntos en la línea
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: { display: true, text: 'Hora' }
            },
            y: {
                suggestedMin: 0,
                suggestedMax: 100,
                beginAtZero: true,
                title: { display: true, text: 'Porcentaje (%)' }
            }
        }
    }
});

// Conectar al broker MQTT
client.connect({
    onSuccess: onConnect,
    onFailure: onFailure,
    useSSL: true
});

// Función ejecutada al conectar con éxito
function onConnect() {
    console.log('✅ Conectado al broker MQTT');

    // Suscribirse a los tópicos
    topics.forEach(topic => {
        client.subscribe(topic, {
            onSuccess: () => console.log(`✅ Suscrito a: ${topic}`),
            onFailure: (error) => console.error(`❌ Error al suscribirse a ${topic}:`, error.errorMessage)
        });
    });

    // Manejo de mensajes recibidos
    client.onMessageArrived = function (message) {
        console.log(`📩 Mensaje en ${message.destinationName}:`, message.payloadString);

        let elementId;
        switch (message.destinationName) {
            case 'sensor/temperatura/tablero':
                elementId = 'temperaturaTablero';
                break;
            case 'sensor/humedad/arandano':
                elementId = 'humedadArandano';
                updateHumedadArandanoChar(parseFloat(message.payloadString)); // Actualizar gráfico
                break;
            case 'sensor/temperatura/rasberry':
                elementId = 'temperaturaRasberry';
                break;
            default:
                console.warn(`⚠️ Tópico desconocido: ${message.destinationName}`);
                return;
        }

        // Actualizar elemento HTML con el dato recibido
        let element = document.getElementById(elementId);
        if (element) {
            element.innerText = message.payloadString;
        } else {
            console.error(`❌ Elemento '${elementId}' no encontrado`);
        }
    };
}

// Función que actualiza el gráfico de humedad del arándano
function updateHumedadArandanoChar(value) {
    let now = new Date();
    let timestamp = now.toLocaleTimeString(); // Guardar solo la hora

    // Agregar nueva lectura
    humedadData.push(value);
    humedadLabels.push(timestamp);

    // Mantener solo las últimas 30 lecturas
    if (humedadData.length > 30) {
        humedadData.shift(); // Eliminar el dato más antiguo
        humedadLabels.shift();
    }

    // Actualizar gráfico
    humedadArandanoChar.data.labels = humedadLabels;
    humedadArandanoChar.data.datasets[0].data = humedadData;
    humedadArandanoChar.update();
}

// Función que se ejecuta si la conexión falla
function onFailure(response) {
    console.error('❌ Error de conexión:', response.errorMessage);
}

// Manejo de desconexión
client.onConnectionLost = function (responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log('⚠️ Desconexión de MQTT:', responseObject.errorMessage);
    }
};
