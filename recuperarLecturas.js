// URL del archivo JSON en el repositorio (reemplaza con el tuyo)
const GITHUB_RAW_URL = "https://github.com/carlos300497/llano-2/blob/main/app.js";

// Función para cargar datos desde GitHub
async function loadHumedadData() {
    try {
        let response = await fetch(GITHUB_RAW_URL);
        if (!response.ok) throw new Error("No se pudo cargar los datos");
        
        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Error cargando datos de GitHub:", error);
        return [];
    }
}

// Actualizar el gráfico con los datos de GitHub
async function updateHumedadArandanoChart() {
    let data = await loadHumedadData();

    if (data.length > 0) {
        humedadArandanoChar.data.labels = data.map(d => d.fecha);
        humedadArandanoChar.data.datasets[0].data = data.map(d => d.valor);
        humedadArandanoChar.update();
    }
}

// Cargar los datos al iniciar la página
document.addEventListener("DOMContentLoaded", updateHumedadArandanoChart);
