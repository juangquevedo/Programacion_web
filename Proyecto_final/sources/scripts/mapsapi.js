let map;
let marker;
let autocomplete;

function initMap() {
    const defaultLocation = { lat: 6.2693, lng: -75.5687 }; // UdeA
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: defaultLocation,
    });

    marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        draggable: true,
    });

    const input = document.getElementById("location-input");
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
            alert("No se encontró información para ese lugar.");
            return;
        }

        map.setCenter(place.geometry.location);
        map.setZoom(15);
        marker.setPosition(place.geometry.location);
    });

    marker.addListener("dragend", function (event) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        console.log("Nueva ubicación: ", lat, lng);
    });
}

function getMarkerPosition() {
    const position = marker.getPosition();
    return { lat: position.lat(), lng: position.lng() };
}

// Registrar evento
document.getElementById("btn-register").addEventListener("click", async () => {
    const titulo = document.getElementById("titulo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const fecha = document.getElementById("fecha").value.trim();
    const hora = document.getElementById("hora").value.trim();
    const tipo_evento = document.getElementById("tipo-evento").value.trim();
    const ubicacion = document.getElementById("location-input").value.trim();
    const coordenadas = getMarkerPosition();

    if (!titulo || !fecha || !hora || !tipo_evento || !ubicacion) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    const eventoData = {
        titulo: titulo,
        descripcion: descripcion,
        fecha: fecha,
        hora: hora,
        ubicacion: ubicacion,
        tipo_evento: tipo_evento,
    };

    console.log("Datos del evento:", eventoData);

    try {
        const response = await fetch("http://localhost:3000/eventos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Usa el token JWT si es necesario
            },
            body: JSON.stringify(eventoData),
        });

        if (response.ok) {
            const data = await response.json();
            alert(`Evento creado con éxito. ID: ${data.id}`);

            invitar(data.id);

            window.location.href = "eventos.html"; // Redirige a la lista de eventos
        } else {
            const error = await response.json();
            alert(`Error al crear el evento: ${error.error}`);
        }
    } catch (error) {
        console.error("Error al enviar datos al backend:", error);
        alert("Error del servidor. Intenta nuevamente.");
    }
});

function invitar(evento_id) {
    var invitados = document.getElementById("invitados").value.trim();
    invitados = invitados.split(',');
    
    invitados.forEach(async invitado => {
        try {
            const response = await fetch("http://localhost:3000/participantes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: invitado, 
                    evento_id:  evento_id    
                }),
            });
    
            if (response.ok) {
                const data = await response.json();
                alert(`Se invito con exito a: ${invitado}`);
            } else {
                const error = await response.json();
                alert(`Error al invitar a: ${invitado}`);
            }
        } catch (error) {
            console.error("Error al enviar datos al backend:", error);
            alert("Error del servidor. Intenta nuevamente.");
        }
    });
}