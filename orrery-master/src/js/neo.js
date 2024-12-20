let mousePosition = { x: 0, y: 0 }; // Store mouse position
let hoveredNEO = null; // Track which NEO is being hovered over
// let hoveredSatellite = null; // Track which satellite is being hovered over
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

    // Fill canvas background with a deep space color
    // c.fillStyle = '#1e2425';
    // c.fillRect(0, 0, canvas.width, canvas.height);

    const earthX = canvas.width / 2;
    const earthY = canvas.height / 2;
    const earthSize = 30;
    const constantNEOSize = 5; // Uniform size for all NEOs

    // Create a gradient for Earth to give it a spherical look
    const earthGradient = c.createRadialGradient(earthX, earthY, earthSize * 0.2, earthX, earthY, earthSize);
    earthGradient.addColorStop(0, '#0d47a1');  // Deep blue at the center
    earthGradient.addColorStop(1, '#2196f3');  // Lighter blue at the edge

    // Draw Earth with gradient and subtle shadow for depth
    c.fillStyle = earthGradient;
    c.beginPath();
    c.arc(earthX, earthY, earthSize, 0, 2 * Math.PI);
    c.fill();

    // Add Earth's label
    c.fillStyle = 'white';
    c.font = '14pt Arial';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText("Earth", earthX, earthY);

    // Track which NEO is hovered
    hoveredNEO = null;

    // Draw each NEO
    neos.forEach((neo, index) => {
        // Calculate the orbit radius based on the NEO's distance from Earth
        const distance = (neo.distanceFromEarth / 0.1) * 50;

        // Draw orbit as a faint circle around Earth
        c.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // Light transparent color for orbit
        c.lineWidth = 1;
        c.beginPath();
        c.arc(earthX, earthY, distance + earthSize, 0, 2 * Math.PI);
        c.stroke();

        // Calculate the angle with a slower speed for the revolution
        const angle = ((index / neos.length) * 2 * Math.PI) + (Date.now() / 100000); // Slower revolution
        const x = earthX + (distance + earthSize) * Math.cos(angle);
        const y = earthY + (distance + earthSize) * Math.sin(angle);

        const dx = mousePosition.x - x;
        const dy = mousePosition.y - y;
        const distanceToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distanceToMouse < constantNEOSize) {
            hoveredNEO = neo;
        }

        // NEO gradient with glow effect
        const neoGradient = c.createRadialGradient(x, y, 0, x, y, constantNEOSize * 2);
        neoGradient.addColorStop(0, 'white');
        neoGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)'); // Fades to transparent

        // Draw NEO with gradient glow effect
        c.fillStyle = neoGradient;
        c.beginPath();
        c.arc(x, y, constantNEOSize, 0, 2 * Math.PI);
        c.fill();

        // Draw NEO name in a smaller, slightly offset font
        c.fillStyle = 'yellow';
        c.font = '7pt Arial';
        c.fillText(neo.name, x, y - constantNEOSize - 5);

        // Hover effect over NEO name
        // const textWidth = c.measureText(neo.name).width;
        // const textHeight = 10; // Approximate height of text in pixels
        // const textX = x - textWidth / 2;
        // const textY = y - constantNEOSize - 5 - textHeight;

        // if (mousePosition.x > textX &&
        //     mousePosition.x < textX + textWidth &&
        //     mousePosition.y > textY &&
        //     mousePosition.y < textY + textHeight) {
        //     hoveredNEO = neo;
        // }
    });

    // Show hover info if hovering over a NEO name
    if (hoveredNEO) {
        showNEOInfo(c, hoveredNEO);
    }

    // Continue animating by calling drawNEOs again
    requestAnimationFrame(drawNEOs);
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
                    
                    // Random distance for each satellite between 100 and 300 (you can adjust the range)
                    const randomDistance = Math.random() * 200 + 100;  // Random distance between 100 and 300
                    
                    satellites.push({
                        name: name,
                        catalogNumber: catalogNumber,
                        orbitalData: orbitalData,
                        distance: randomDistance, // Store the random distance
                        angle: Math.random() * 2 * Math.PI  // Random initial angle
                    });
                }
            }

            drawSatellites();
        })
        .catch(error => console.error('Error fetching satellite data:', error));
}

// Function to draw satellites and make them revolve
function drawSatellites() {
    const canvas = document.getElementById('neoCanvas2');
    const c = canvas.getContext('2d');
    canvas.width = 750;
    canvas.height = 750;

    const earthX = canvas.width / 2;
    const earthY = canvas.height / 2;
    const earthSize = 30;

    // Draw Earth
    const earthGradient = c.createRadialGradient(earthX, earthY, earthSize * 0.2, earthX, earthY, earthSize);
    earthGradient.addColorStop(0, '#0d47a1');  // Deep blue at the center
    earthGradient.addColorStop(1, '#2196f3');  // Lighter blue at the edge

    // Draw Earth with gradient and subtle shadow for depth
    c.fillStyle = earthGradient;
    c.beginPath();
    c.arc(earthX, earthY, earthSize, 0, 2 * Math.PI);
    c.fill();

    // Add Earth's label
    c.fillStyle = 'white';
    c.font = '14pt Arial';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText("Earth", earthX, earthY);

    // Track which satellite is hovered
    hoveredSatellite = null;

    // Draw each satellite around Earth
    satellites.forEach((sat, index) => {
        // Update the angle of the satellite for animation
        sat.angle += 0.0001;  // Slow down the revolution speed

         // Draw the satellite's orbit
        c.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // Faint orbit lines
        c.lineWidth = 1;
        c.beginPath();
        c.arc(earthX, earthY, sat.distance + earthSize, 0, 2 * Math.PI); // Orbit radius
        c.stroke();

        // Calculate the satellite's position based on the distance and angle
        const x = earthX + (sat.distance + earthSize) * Math.cos(sat.angle);
        const y = earthY + (sat.distance + earthSize) * Math.sin(sat.angle);
        const size = 10;

        // Calculate the distance between the mouse and the satellite
        const dx = mousePosition.x - x;
        const dy = mousePosition.y - y;
        const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

        // Check if the mouse is close to the satellite (hover effect)
        if (distanceToMouse < size) {
            hoveredSatellite = sat;
        }

        // Highlight the hovered satellite with a glowing effect
        const glowRadius = hoveredSatellite === sat ? size * 2 : size;
        const glowColor = hoveredSatellite === sat ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)';

        const satGradient = c.createRadialGradient(x, y, 0, x, y, glowRadius);
        satGradient.addColorStop(0, 'white');
        satGradient.addColorStop(1, glowColor);

        c.fillStyle = satGradient;
        c.beginPath();
        c.arc(x, y, size, 0, 2 * Math.PI);
        c.fill();

        // Draw satellite name
        c.fillStyle = 'yellow';
        c.font = '7pt Arial';
        c.fillText(sat.name, x, y - size - 5);
    });

    // If a satellite is hovered, show its info
    if (hoveredSatellite) {
        showSatelliteInfo(c, hoveredSatellite);
    }

    // Request the next animation frame to keep the satellites revolving
    requestAnimationFrame(drawSatellites);
}

// Function to display satellite info when hovered
function showSatelliteInfo(c, sat) {
    const infoX = mousePosition.x - 50; // Position the tooltip near the mouse
    const infoY = mousePosition.y + 20;

    c.fillStyle = "rgba(0, 0, 0, 0.8)"; // Tooltip background
    c.fillRect(infoX, infoY, 250, 90); // Info box size

    c.fillStyle = "white";
    c.font = '12pt Arial';
    c.fillText(`Name: ${sat.name}`, infoX + 10, infoY + 20);
    c.fillText(`Catalog #: ${sat.catalogNumber}`, infoX + 10, infoY + 40);
    c.fillText(`Orbital Data: ${sat.orbitalData}`, infoX + 10, infoY + 60);
}

document.getElementById('neoCanvas2').addEventListener('mousemove', (event) => {
    const rect = event.target.getBoundingClientRect();
    mousePosition.x = event.clientX - rect.left;
    mousePosition.y = event.clientY - rect.top;
});

// Fetch data when the window loads
window.onload = function() {
    fetchNEOs();
    fetchSatellites();
};

// Refresh data every 10 minutes
setInterval(fetchNEOs, 600000);
setInterval(fetchSatellites, 600000);
