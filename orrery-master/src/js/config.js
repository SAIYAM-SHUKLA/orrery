const planets = {
    //       [Name,         size,  dist sol,  orbit,  x coord, y coord, radius, sAngle, eAngle, colour,     textColour]
    sun:     ["Sun",        15,    0,         0,      775,     775,     30,     0,      2,      "yellow",    "black"],
    mercury: ["Mercury",    1,     1.5,         88,     750,     750,     5,      0,      2,      "silver",    "white"],
    venus:   ["Venus",      2,     3,         225,    740,     740,     10,     0,      2,      "purple",    "white"],
    earth:   ["Earth",      2.5,   4.5,         365,    650,     650,     12,     0,      2,      "blue",    "white"],
    mars:    ["Mars",       1.25,  6,         687,    600,     600,     10,     0,      2,      "red",      "white"],
    jupiter: ["Jupiter",    27.5,  7.5,        4331,   550,     550,     20,     0,      2,      "orange",    "white"],
    saturn:  ["Saturn",     24.75, 9,        10747,  500,     500,     18,     0,      2,      "moccasin",  "white"],
    uranus:  ["Uranus",     2,     10.5,         500,  450,     450,     16,     0,      2,      "aqua",     "white"],
    neptune: ["Neptune",    3,     12,         2000,  400,     400,     12,     0,      2,      "blue",     "white"]
};

const planetInfo = {
    sun: {
        mass: "1.989 × 10^30 kg",
        radius: "695,700 km",
        temperature: "5,500 °C",
        composition: "Hydrogen and Helium",
    },
    mercury: {
        mass: "3.285 × 10^23 kg",
        radius: "2,439.7 km",
        temperature: "430 °C (day), -180 °C (night)",
        composition: "Iron and Silicate",
    },
    venus: {
        mass: "4.867 × 10^24 kg",
        radius: "6,051.8 km",
        temperature: "462 °C",
        composition: "Carbon Dioxide and Nitrogen",
    },
    earth: {
        mass: "5.972 × 10^24 kg",
        radius: "6,371 km",
        temperature: "15 °C",
        composition: "Nitrogen and Oxygen",
    },
    mars: {
        mass: "6.4171 × 10^23 kg",
        radius: "3,389.5 km",
        temperature: "-63 °C",
        composition: "Carbon Dioxide",
    },
    jupiter: {
        mass: "1.898 × 10^27 kg",
        radius: "69,911 km",
        temperature: "-145 °C",
        composition: "Hydrogen and Helium",
    },
    saturn: {
        mass: "5.683 × 10^26 kg",
        radius: "58,232 km",
        temperature: "-178 °C",
        composition: "Hydrogen and Helium",
    },
    uranus: {
        mass: "8.681 × 10^25 kg",
        radius: "25,362 km",
        temperature: "-197 °C",
        composition: "Hydrogen, Helium, and Methane",
    },
    neptune: {
        mass: "1.024 × 10^26 kg",
        radius: "24,622 km",
        temperature: "-201 °C",
        composition: "Hydrogen, Helium, and Methane",
    }
};

const properties = {
    canvasName: "orrery",
    canvasContext: "2d",
    canvasWidth: 1550,
    canvasHeight: 1500
};
