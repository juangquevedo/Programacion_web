// Función para cargar eventos desde el JSON
async function cargarEventos() {
    try {
        // Obtiene los datos del archivo JSON
        const response = await fetch('eventos.json');
        const eventos = await response.json();

        // Contenedor de eventos
        const container = document.getElementById('eventos-container');

        // Itera sobre cada evento y genera el HTML dinámico
        eventos.forEach(evento => {
            const eventoHTML = `
                <div class="flex items-center">
                    <div class="flex-1">
                        <h2 class="text-2xl font-bold">${evento.titulo}</h2>
                        <p class="text-gray-400 mt-2">${evento.descripcion}</p>
                        <a href="#" class="text-yellow-500 mt-2 block">VER DETALLES</a>
                    </div>
                    <img src="${evento.imagen}" alt="Imagen del evento" class="w-32 h-32 rounded-lg">
                </div>
            `;
            container.innerHTML += eventoHTML;
        });
    } catch (error) {
        console.error('Error al cargar los eventos:', error);
    }
}

// Llama a la función para cargar los eventos al cargar la página
cargarEventos();
