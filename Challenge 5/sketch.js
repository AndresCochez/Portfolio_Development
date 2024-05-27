// Initialiseren van de kaart
var map = L.map('map').setView([51.004284, 4.300979], 15); // Coördinaten van Linde 20, Londerzeel
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Marker voor eigen locatie
var myLocationMarker;

// Lijst met locaties en vragen
var locations = [
    { name: "Lindehoeve", coords: [51.006234, 4.301173], question: "Hoeveel melkkoeien heeft de Lindehoeve?" },
    { name: "Gemeentehuis Londerzeel", coords: [51.002217, 4.302933], question: "Wanneer werd het gemeentehuis van Londerzeel gebouwd?" },
    { name: "Kerk Sint-Kristoffel", coords: [51.004994, 4.303611], question: "Wat is de naam van de patroonheilige van de kerk Sint-Kristoffel?" },
    { name: "Londerzeelbos", coords: [51.001595, 4.294814], question: "Hoeveel hectare beslaat het Londerzeelbos?" },
    { name: "Kasteel van Malderen", coords: [51.003857, 4.326211], question: "In welk jaar werd het Kasteel van Malderen gebouwd?" }
];

// Voeg markers toe voor elke locatie
locations.forEach(location => {
    var marker = L.marker(location.coords).addTo(map).bindPopup(location.name);
    marker.on('click', function () {
        var distance = calculateDistance(location.coords); // Bereken afstand tussen speler en locatie
        if (distance < 100) { // Stel een maximale afstand in (bijv. 100 meter)
            var answer = prompt(location.question);
            // Controleer of het antwoord correct is en verwerk punten
        } else {
            alert("Je bent nog te ver van deze locatie!");
        }
    });
    var listItem = document.createElement('li');
    listItem.textContent = location.name;
    document.getElementById('locations').appendChild(listItem);
});

// Bereken afstand tussen twee geografische coördinaten
function calculateDistance(coords) {
    // Simpele afstandsformule (niet perfect, maar voldoende voor dit spel)
    var lat1 = coords[0];
    var lon1 = coords[1];
    var lat2 = parseFloat(localStorage.getItem('latitude'));
    var lon2 = parseFloat(localStorage.getItem('longitude'));

    var R = 6371e3; // straal van de aarde in meters
    var φ1 = lat1 * Math.PI / 180;
    var φ2 = lat2 * Math.PI / 180;
    var Δφ = (lat2-lat1) * Math.PI / 180;
    var Δλ = (lon2-lon1) * Math.PI / 180;

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    return d;
}

// Vraag om geolocatie van de speler
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        localStorage.setItem('latitude', lat);
        localStorage.setItem('longitude', lon);

        // Toon marker voor eigen locatie
        myLocationMarker = L.marker([lat, lon]).addTo(map).bindPopup("Jouw locatie");
    });
} else {
    alert("Geolocation wordt niet ondersteund door deze browser.");
}