let mousePosition = { x: 0, y: 0 }; // Store mouse position
let hoveredNEO = null; // Track which NEO is being hovered over

const apiKey = 'Cm6tszaVWxMCt8xEzk9fWbIY9AP9LB8PIkxE0mif';  // NASA API key
let neos = [];

function fetchNEOs() {
    // NASA NeoWs API URL for Near-Earth Objects today
    const today = new Date().toISOString().split('T')[0]; // Format today's date as YYYY-MM-DD
    const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${apiKey}`;

    // Fetch real-time NEO data
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Clear the existing NEOs array
            neos = [];

            // Iterate over each NEO in the API response
            const neoData = data.near_earth_objects[today];
            neoData.forEach(neo => {
                const distanceFromEarth = parseFloat(neo.close_approach_data[0].miss_distance.astronomical); // Get distance in AU
                const size = (neo.estimated_diameter.kilometers.estimated_diameter_min + neo.estimated_diameter.kilometers.estimated_diameter_max) / 2;

                // Add NEO data to the array
                neos.push({
                    name: neo.name,
                    size: size,
                    distanceFromEarth: distanceFromEarth,
                });
            });

            // Re-draw NEOs on the canvas
            drawNEOs();
        })
        .catch(error => console.error('Error fetching NEO data:', error));
}

function drawNEOs() {
    const canvas = document.getElementById('neoCanvas');
    canvas.width = 750;
    canvas.height = 750;
    const c = canvas.getContext('2d');

    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        mousePosition.x = event.clientX - rect.left;
        mousePosition.y = event.clientY - rect.top;
    });

    function update() {
        // Clear canvas
        c.fillStyle = 'black';
        c.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Earth in the middle of the canvas
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

        hoveredNEO = null;  // Reset hovered NEO

        // Draw the NEOs
        neos.forEach((neo, index) => {
            const angle = (index / neos.length) * 2 * Math.PI;
            const distance = (neo.distanceFromEarth / 0.1) * 50;
            const x = earthX + (distance + earthSize) * Math.cos(angle);
            const y = earthY + (distance + earthSize) * Math.sin(angle);

            const size = neo.size * 80;  // Increase NEO size for visibility

            // Check if mouse is hovering over this NEO
            const dx = mousePosition.x - x;
            const dy = mousePosition.y - y;
            const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

            if (distanceToMouse < size) {
                hoveredNEO = neo; // If hovering, set hoveredNEO to the current NEO
            }

            // Draw the NEO
            c.beginPath();
            c.arc(x, y, size, 0, 2 * Math.PI);
            c.fillStyle = 'white';
            c.fill();

            // Draw NEO name
            c.fillStyle = 'yellow';
            c.font = '7pt Arial';
            c.fillText(neo.name, x, y - size - 5);
        });

        // If a NEO is being hovered over, show its information
        if (hoveredNEO) {
            showNEOInfo(c, hoveredNEO);
        }

        requestAnimationFrame(update);  // Continuously update the canvas
    }

    update();  // Start the update loop
}

// Function to display NEO info when hovered
function showNEOInfo(c, neo) {
    const infoX = mousePosition.x - 50;  // Position the tooltip near the mouse
    const infoY = mousePosition.y + 20;

    c.fillStyle = "rgba(0, 0, 0, 0.8)";  // Tooltip background
    c.fillRect(infoX, infoY, 200, 70);  // Info box size

    c.fillStyle = "white";
    c.font = '12pt Arial';
    c.fillText(`Name: ${neo.name}`, infoX + 90, infoY + 20);
    c.fillText(`Size: ${neo.size} km`, infoX + 90, infoY + 40);
    c.fillText(`Distance: ${neo.distanceFromEarth} AU`, infoX + 100, infoY + 60);
}

// Fetch NEO data when the window loads
window.onload = fetchNEOs;

// Refresh NEO data every 10 minutes (600000 milliseconds)
setInterval(fetchNEOs, 600000);
