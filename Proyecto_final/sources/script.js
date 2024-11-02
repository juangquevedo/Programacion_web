let map;
let marker;
let autocomplete;

function initMap() {
    // Inicializa el mapa centrado en una ubicación predeterminada
    const defaultLocation = { lat: 6.2693, lng: -75.5687 }; // ubicacion de la UdeA 
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: defaultLocation,
    });

    // Coloca un marcador en la ubicación predeterminada
    marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        draggable: true,
    });

    // Configura el autocompletado en el campo de entrada de ubicación
    const input = document.getElementById("location-input");
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);

    // Listener para cuando se selecciona una ubicación
    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
            alert("No se encontró información para ese lugar.");
            return;
        }

        // Centra el mapa en la ubicación seleccionada
        map.setCenter(place.geometry.location);
        map.setZoom(15);

        // Coloca o mueve el marcador a la nueva ubicación
        marker.setPosition(place.geometry.location);
    });

    // Listener para mover el marcador cuando es arrastrado
    marker.addListener('dragend', function(event) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        console.log("Nueva ubicación: ", lat, lng);
    });
}
