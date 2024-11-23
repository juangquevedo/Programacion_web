// Verifica si hay un token almacenado
const token = sessionStorage.getItem("token");

if (!token) {
    alert("Por favor, inicia sesión para ver tus eventos.");
    window.location.href = "login.html"; // Redirige al inicio de sesión
}

const cargarEventos = async () => {
    try {
        const response = await fetch("http://localhost:3000/eventos", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Incluye el token en la solicitud
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
                localStorage.removeItem("token");
                window.location.href = "login.html";
            } else {
                alert("Error al cargar los eventos.");
            }
            return;
        }

        const eventos = await response.json();
        mostrarEventos(eventos);
    } catch (error) {
        console.error("Error al cargar los eventos:", error);
        alert("Ocurrió un error al intentar cargar los eventos.");
    }
};

const mostrarEventos = (eventos) => {
    const eventosContainer = document.getElementById("eventos-container");
    eventosContainer.innerHTML = ""; // Limpia el contenedor antes de agregar nuevos eventos

    if (eventos.length === 0) {
        eventosContainer.innerHTML = "<p class='text-center'>No tienes eventos registrados.</p>";
        return;
    }

    eventos.forEach(evento => {
        const eventoDiv = document.createElement("div");
        eventoDiv.className = "bg-[#0EB1D0] p-6 rounded-lg shadow-md";

        eventoDiv.innerHTML = `
            <h2 class="text-2xl font-bold mb-2">${evento.titulo}</h2>
            <p class="mb-2">${evento.descripcion}</p>
            <p class="text-sm mb-2"><strong>Fecha:</strong> ${evento.fecha}</p>
            <p class="text-sm mb-2"><strong>Hora:</strong> ${evento.hora}</p>
            <p class="text-sm"><strong>Ubicación:</strong> ${evento.ubicacion}</p>
        `;

        eventosContainer.appendChild(eventoDiv);
    });
};

// Llama a la función para cargar los eventos al cargar la página
document.addEventListener("DOMContentLoaded", cargarEventos);