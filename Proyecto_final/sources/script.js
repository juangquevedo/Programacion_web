function initMap() {
    const location = { lat: 6.2693, lng: -75.5687 }; // ubicacion de la UdeA 42474202241, 7708784296
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: location,
    });
    new google.maps.Marker({
        position: location,
        map: map,
    });
}