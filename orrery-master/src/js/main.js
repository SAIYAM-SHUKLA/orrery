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

//changes
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

            // Check if the mouse is hovering over this planet
            if (isMouseHovering(mousePosition, planets[p])) {
                hoveredPlanet = planets[p];  // Set hovered planet
            }
        }
    }

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

//chganes
function showPlanetInfo(c, planet) {
    const infoX = mousePosition.x + 10;  // Position of info box
    const infoY = mousePosition.y + 10;

    c.fillStyle = "rgba(0, 0, 0, 0.8)";  // Info box background
    c.fillRect(infoX, infoY, 400, 140);  // Draw info box

    c.fillStyle = "white";
    c.font = '14pt Arial';

    // Display basic information
    c.fillText(`Name: ${planet[0]}`, infoX + 10, infoY + 20);
    // c.fillText(`Size: ${planet[1]}`, infoX + 10, infoY + 40);
   
    
    // Add scientifically accurate information
    if (planetInfo[planet[0].toLowerCase()]) {
        const info = planetInfo[planet[0].toLowerCase()];
        c.fillText(`Distance: ${info.distance}`, infoX + 10, infoY + 40);
        c.fillText(`Mass: ${info.mass}`, infoX + 10, infoY + 60);
        c.fillText(`Radius: ${info.radius}`, infoX + 10, infoY + 80);
        c.fillText(`temp: ${info.temperature}`, infoX + 10, infoY + 100);
        c.fillText(`composition: ${info.composition}`, infoX + 10, infoY + 120);
    }
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
    const [name, size, , , x, y, radius, , , color] = planet;

    // Log radius to check if it’s set properly for each planet
    console.log(`Drawing ${name}: radius = ${radius}, x = ${x}, y = ${y}, color = ${color}`);

    // Check if the planet is the Sun for unique rendering
    if (name === "Sun") {
        const sunGradient = c.createRadialGradient(x, y, radius * 0.5, x, y, radius * 2);
        sunGradient.addColorStop(0, 'yellow');
        sunGradient.addColorStop(1, 'rgba(255, 140, 0, 0.2)');

        c.fillStyle = sunGradient;
    } else {
        // Create a radial gradient for each planet
        const gradient = c.createRadialGradient(x, y, radius * 0.3, x, y, radius);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, '#1e2425');

        c.fillStyle = gradient;
    }

    // Draw the planet (or Sun) with its calculated or default gradient
    c.beginPath();
    c.arc(x, y, radius, 0, 2 * Math.PI);
    c.fill();

    // Display the name of each planet above it
    c.font = '14px Arial';
    c.fillStyle = 'white';
    c.fillText(name, x, y - radius - 10);

    if (name === "Saturn") {
        const ringColors = ["rgba(245, 222, 179, 0.5)", "rgba(255, 215, 0, 0.3)", "rgba(255, 223, 186, 0.2)"];
        const ringThickness = [radius * 1.8, radius * 2.1, radius * 2.4]; // Different sizes for each ring layer

        ringColors.forEach((ringColor, index) => {
            c.strokeStyle = ringColor;
            c.lineWidth = 3;  // Adjust thickness for a refined look
            c.beginPath();
            // Create layered ellipses with slight opacity and different sizes
            c.ellipse(x, y, ringThickness[index], radius * 0.6, 0, 0, 2 * Math.PI);
            c.stroke();
        });
    }
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

//this is to check the commit
const canvas = document.getElementById(properties.canvasName);

canvas.addEventListener('mousemove', function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const earth = planets.earth;
    const dist = Math.sqrt((mouseX - earth[4]) ** 2 + (mouseY - earth[5]) ** 2); // Calculate distance from Earth center

    // If hovering over Earth, change cursor to pointer
    if (dist <= earth[6]) {
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.cursor = 'default';
    }
});

canvas.addEventListener('click', function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const earth = planets.earth;
    const dist = Math.sqrt((mouseX - earth[4]) ** 2 + (mouseY - earth[5]) ** 2);  // Calculate distance from Earth center

    // Redirect to NEO page if the click is within Earth's radius
    if (dist <= earth[6]) {
        console.log("Earth clicked! Redirecting to NEO page...");
        window.location.href = "earth_neos.html";  // Redirect to earth_neos.html
    }
});

