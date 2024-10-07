let mousePosition = { x: 0, y: 0 }; //changes
let hoveredPlanet = null; //changes

function main() {
    const c = initCanvas();
    animate(c);  // Start the animation loop
    generateStars(c);

    for (let p in planets) {
        drawOrbit(c, planets[p]);
        drawPlanet(c, planets[p]);
    }
    // infoTable()
}

function initCanvas() {
    const canvas = document.getElementById(properties.canvasName);
    canvas.width = 1510;
    canvas.height = 1510;
    var ctx = canvas.getContext(properties.canvasContext);
    return ctx;
}

document.getElementById(properties.canvasName).addEventListener('mousemove', function(event) {
    const rect = event.target.getBoundingClientRect();
    mousePosition.x = event.clientX - rect.left; // Adjust for canvas position
    mousePosition.y = event.clientY - rect.top;
});

// Function to update planet positions based on time
function updatePlanetPosition(planet, time) {
    // Ensure orbit time isn't zero to avoid division by zero
    const orbitTime = planet[3] || 1;  
    const distanceFromSun = planet[2]; // Distance from the sun (dist sol)
    const angle = (time / orbitTime) * 2 * Math.PI;  // Calculate angle based on orbit time
    
    // Update planet x and y positions using trigonometry for orbit
    planet[4] = planets.sun[4] + distanceFromSun * 50 * Math.cos(angle); // Update x position, scale by 50
    planet[5] = planets.sun[5] + distanceFromSun * 50 * Math.sin(angle); // Update y position, scale by 50
}

function animate(c) {
    const time = Date.now() * 0.001;

    // Clear the canvas before each frame
    c.clearRect(0, 0, c.canvas.width, c.canvas.height);

    // Draw the stars (without moving them)
    drawStars(c);

    // Draw the sun (it doesn’t move)
    drawPlanet(c, planets.sun);

    //changes
    hoveredPlanet = null;  // Reset hovered planet for each frame

    // Update and draw each planet
    for (let p in planets) {
        if (p !== "sun") {
            updatePlanetPosition(planets[p], time);  // Update planet position based on orbit time
            drawOrbit(c, planets[p]);  // Draw orbit path
            drawPlanet(c, planets[p]);  // Draw the planet

            //changes
            // Check if the mouse is hovering over this planet
            if (isMouseHovering(mousePosition, planets[p])) {
                hoveredPlanet = planets[p];  // Set hovered planet
            }
        }
    }

    //changes
    // If the mouse is hovering over a planet, show its information
    if (hoveredPlanet) {
        showPlanetInfo(c, hoveredPlanet);
    }
    // Call `animate` again on the next frame
    requestAnimationFrame(() => animate(c));
}

//changes
function isMouseHovering(mouse, planet) {
    const dx = mouse.x - planet[4];  // Difference between mouse and planet x position
    const dy = mouse.y - planet[5];  // Difference between mouse and planet y position
    const distance = Math.sqrt(dx * dx + dy * dy);  // Pythagorean theorem

    console.log(`Checking hover for: ${planet[0]}, distance: ${distance}, radius: ${planet[6]}`);

    return distance < planet[6];  // Check if the distance is less than the planet radius
}

//changes
function showPlanetInfo(c, planet) {
    const infoX = mousePosition.x + 10;  // Position of info box
    const infoY = mousePosition.y + 10;

    c.fillStyle = "rgba(0, 0, 0, 0.8)";  // Info box background
    c.fillRect(infoX, infoY, 150, 70);  // Draw info box

    c.fillStyle = "white";
    c.font = '14pt Arial';
    c.fillText(`Name: ${planet[0]}`, infoX + 10, infoY + 20);
    c.fillText(`Size: ${planet[1]}`, infoX + 10, infoY + 40);
    c.fillText(`Distance: ${planet[2]}`, infoX + 10, infoY + 60);
}



let stars = [];  // Store the star coordinates here

function generateStars(c) {
    const numStars = 500;  // Define the number of stars you want
    const canvasWidth = c.canvas.clientWidth;
    const canvasHeight = c.canvas.clientHeight;
    
    for (let i = 0; i < numStars; i++) {
        // Generate random x and y positions for stars
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        stars.push({ x: x, y: y });  // Store each star's coordinates
    }
}

function drawStars(c) {
    c.fillStyle = "white";
    stars.forEach(star => {
        // Draw stars at their fixed positions
        c.fillRect(star.x, star.y, 1, 1);
    });
}

// Draw planet and its label
function drawPlanet(c, planet) {
    drawArc(c, planet[4], planet[5], planet[6], planet[7], planet[8], planet[9], planet[0], planet[10]);
}

// Draw circular orbit around the sun
function drawOrbit(c, planet) {
    if (planet[0] !== 'Sun') {
        c.beginPath();
        // Use planet[2], which is the distance from the sun, as the radius for the orbit
        c.arc(planets.sun[4], planets.sun[5], planet[2] * 50, 0, 2 * Math.PI);  // Multiply by 50 to scale the orbits
        c.lineWidth = 1;
        c.strokeStyle = "white";
        c.stroke();
    }
}

// Function to draw an arc representing the planet's body
function drawArc(c, x, y, r, sAngle, eAngle, colour, name, textColour) {
    c.fillStyle = colour;
    c.beginPath();
    c.arc(x, y, r, sAngle, eAngle * Math.PI);
    c.fill();
    c.font = '20pt Arial';
    c.fillStyle = textColour;
    c.textAlign = 'center';
    c.fillText(name, x, y);
}

// Generate info table in HTML
function infoTable() {
    var info = document.getElementById('info-table');
    info.innerHTML += `
    <tr>
        <th>Planet</th>
        <th>Size</th>
        <th>Distance from Sun</th>
        <th>Time for orbit</th>
        <th>Colour</th>
    </tr>
    `;
    for (let p in planets) {
        info.innerHTML += 
        "<tr>"+
           "<td>"+planets[p][0]+"</td>" +
           "<td>"+planets[p][1]+"</td>" +
           "<td>"+planets[p][2]+"</td>" +
           "<td>"+planets[p][3]+"</td>" +
           "<td>"+planets[p][9]+"</td>" + 
        "</tr>";
    }
}

