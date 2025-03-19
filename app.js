document.addEventListener('DOMContentLoaded', function() {
    // Ejemplo de datos estáticos, reemplazar con llamada a API real
    const data = {
        soilMoisture: '45%',
        waterLevel: '75%',
        valveStatus: 'Abiertas'
    };

    document.getElementById('soil-moisture').textContent = data.soilMoisture;
    document.getElementById('water-level').textContent = data.waterLevel;
    document.getElementById('valve-status').textContent = data.valveStatus;

    // Aquí puedes agregar lógica para actualizar los datos en tiempo real
    // usando fetch() para llamar a tu API y actualizar el DOM
});