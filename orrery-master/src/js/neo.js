let mousePosition = { x: 0, y: 0 }; // Store mouse position
let hoveredNEO = null; // Track which NEO is being hovered over
const apiKey = 'Cm6tszaVWxMCt8xEzk9fWbIY9AP9LB8PIkxE0mif'; // Replace with your NASA API key

let neos = [];
let satellites = [];

// Fetch Near-Earth Objects (NEOs)
function fetchNEOs() {
    const today = new Date().toISOString().split('T')[0];
    const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${apiKey}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            neos = [];
            const neoData = data.near_earth_objects[today];
            neoData.forEach(neo => {
                const distanceFromEarth = parseFloat(neo.close_approach_data[0].miss_distance.astronomical);
                const size = (neo.estimated_diameter.kilometers.estimated_diameter_min + neo.estimated_diameter.kilometers.estimated_diameter_max) / 2;
                neos.push({ name: neo.name, size: size, distanceFromEarth: distanceFromEarth });
            });
            drawNEOs();
        })
        .catch(error => console.error('Error fetching NEO data:', error));
}

function drawNEOs() {
    const canvas = document.getElementById('neoCanvas');
    const c = canvas.getContext('2d');
    canvas.width = 750;
    canvas.height = 750;

    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    const earthX = canvas.width / 2;
    const earthY = canvas.height / 2;
    const earthSize = 30;

    c.fillStyle = 'blue';
    c.beginPath();
    c.arc(earthX, earthY, earthSize, 0, 2 * Math.PI);
    c.fill();
    c.fillStyle = 'white';
    c.font = '14pt Arial';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText("Earth", earthX, earthY);

    // Mouse move event for tracking hover
    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        mousePosition.x = event.clientX - rect.left;
        mousePosition.y = event.clientY - rect.top;
        hoveredNEO = null; // Reset hovered NEO

        // Check if hovering over any NEO
        neos.forEach((neo, index) => {
            const angle = (index / neos.length) * 2 * Math.PI;
            const distance = (neo.distanceFromEarth / 0.1) * 50;
            const x = earthX + (distance + earthSize) * Math.cos(angle);
            const y = earthY + (distance + earthSize) * Math.sin(angle);
            const size = neo.size * 8;

            // Check if mouse is hovering over this NEO
            const dx = mousePosition.x - x;
            const dy = mousePosition.y - y;
            const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

            if (distanceToMouse < size) {
                hoveredNEO = neo; // Set hoveredNEO to the current NEO
            }
        });
    });

    // Draw the NEOs
    neos.forEach((neo, index) => {
        const angle = (index / neos.length) * 2 * Math.PI;
        const distance = (neo.distanceFromEarth / 0.1) * 50;
        const x = earthX + (distance + earthSize) * Math.cos(angle);
        const y = earthY + (distance + earthSize) * Math.sin(angle);
        const size = neo.size * 8;

        c.beginPath();
        c.arc(x, y, size, 0, 2 * Math.PI);
        c.fillStyle = 'white';
        c.fill();
        c.fillStyle = 'yellow';
        c.font = '7pt Arial';
        c.fillText(neo.name, x, y - size - 5);
    });

    // Show info if hovering over a NEO
    if (hoveredNEO) {
        showNEOInfo(c, hoveredNEO);
    }

    requestAnimationFrame(drawNEOs); // Continue the drawing loop
}

// Function to display NEO info when hovered
function showNEOInfo(c, neo) {
    const infoX = mousePosition.x - 50; // Position the tooltip near the mouse
    const infoY = mousePosition.y + 20;

    c.fillStyle = "rgba(0, 0, 0, 0.8)"; // Tooltip background
    c.fillRect(infoX, infoY, 200, 70); // Info box size

    c.fillStyle = "white";
    c.font = '12pt Arial';
    c.fillText(`Name: ${neo.name}`, infoX + 10, infoY + 20);
    c.fillText(`Size: ${neo.size} km`, infoX + 10, infoY + 40);
    c.fillText(`Distance: ${neo.distanceFromEarth} AU`, infoX + 10, infoY + 60);
}

document.getElementById('neoCanvas').addEventListener('mousemove', (event) => {
    const rect = event.target.getBoundingClientRect();
    mousePosition.x = event.clientX - rect.left;
    mousePosition.y = event.clientY - rect.top;
});

// Fetch Satellite Data from SATCAT API
function fetchSatellites() {
    const apiUrl = 'https://celestrak.com/NORAD/elements/stations.txt';

    fetch(apiUrl)
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            satellites = [];

            for (let i = 0; i < lines.length; i += 3) {
                if (lines[i] && lines[i + 1] && lines[i + 2]) {
                    const name = lines[i].trim();
                    const catalogNumber = lines[i + 1].trim();
                    const orbitalData = lines[i + 2].trim();
                    
                    satellites.push({
                        name: name,
                        catalogNumber: catalogNumber,
                        orbitalData: orbitalData
                    });
                }
            }

            drawSatellites();
        })
        .catch(error => console.error('Error fetching satellite data:', error));
}

function drawSatellites() {
    const canvas = document.getElementById('neoCanvas2');
    const c = canvas.getContext('2d');
    canvas.width = 750;
    canvas.height = 750;

    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    const earthX = canvas.width / 2;
    const earthY = canvas.height / 2;
    const earthSize = 30;

    // Draw Earth
    c.fillStyle = 'blue';
    c.beginPath();
    c.arc(earthX, earthY, earthSize, 0, 2 * Math.PI);
    c.fill();
    c.fillStyle = 'white';
    c.font = '14pt Arial';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText("Earth", earthX, earthY);

    // Draw each satellite around Earth based on their position
    satellites.forEach((sat, index) => {
        const angle = (index / satellites.length) * 2 * Math.PI;
        const distance = 200; // Set a fixed distance for display purposes
        const x = earthX + (distance + earthSize) * Math.cos(angle);
        const y = earthY + (distance + earthSize) * Math.sin(angle);
        const size = 10;

        c.beginPath();
        c.arc(x, y, size, 0, 2 * Math.PI);
        c.fillStyle = 'white';
        c.fill();

        c.fillStyle = 'yellow';
        c.font = '7pt Arial';
        c.fillText(sat.name, x, y - size - 5);
    });
}

// Fetch data when the window loads
window.onload = function() {
    fetchNEOs();
    fetchSatellites();
};

// Refresh data every 10 minutes
setInterval(fetchNEOs, 600000);
setInterval(fetchSatellites, 600000);
