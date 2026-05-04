// Simple graph representing mall layout
const mallGraph = {
  Entrance: { "Blue Tokai": 2, "Zara": 5, "H&M": 7, "Cafe": 8, "Pixy Land": 3, "Barista": 6, "Only": 8, "Croma": 4 },
  "Blue Tokai": { Entrance: 2, Zara: 3, "Pixy Land": 1, Safari: 4, Barista: 2, Bata: 3 },
  "Pixy Land": { "Blue Tokai": 1, Entrance: 3 },
  Zara: { Entrance: 5, "Blue Tokai": 3, "H&M": 3, Max: 2, Portico: 2, "Nykaa Beauty": 3, "Bata": 4, Only: 3, Barista: 3 },
  "H&M": { Entrance: 7, Zara: 3, Easybuy: 2, "New Me": 2, "Home Centre": 5, "Cafe": 6, Only: 4 },
  "Max": { Zara: 2, "Portico": 1, "Nykaa Beauty": 3 },
  "Portico": { Zara: 2, "Max": 1, "Safari": 2 },
  "Safari": { Portico: 2, "Mia": 1, "Blue Tokai": 4 },
  "Mia": { Safari: 1, "Blue stone": 2 },
  "Blue stone": { Mia: 2, "Cafe": 2 },
  "Cafe": { "Blue stone": 2, "New Me": 3, "H&M": 6 },
  "New Me": { "H&M": 2, "Cafe": 3, "Easybuy": 1 },
  "Easybuy": { "H&M": 2, "New Me": 1 },
  "Nykaa Beauty": { Max: 3, Bata: 2, Puma: 4, Zara: 3 },
  Bata: { "Nykaa Beauty": 2, Barista: 2, Puma: 2, Zara: 4, "Blue Tokai": 3 },
  Puma: { Bata: 2, "Nykaa Beauty": 4, Only: 1 },
  Only: { Puma: 1, Barista: 2, "Fab India": 2, Zara: 3, "H&M": 4, Entrance: 8 },
  Barista: { Bata: 2, Only: 2, "Fab India": 1, Zara: 3, "Blue Tokai": 2, Entrance: 6 },
  "Fab India": { Barista: 1, Only: 2, "Vero Moda": 1, Chunmun: 3 },
  "Vero Moda": { "Fab India": 1, Arrow: 4 },
  Arrow: { "Vero Moda": 4, Croma: 2, Azorte: 3 },
  Croma: { Arrow: 2, Azorte: 2, Entrance: 4 },
  Azorte: { Croma: 2, Arrow: 3, Chunmun: 4 },
  Chunmun: { Azorte: 4, "Fab India": 3, Manyavar: 2 },
  Manyavar: { Chunmun: 2, Toyzone: 3 },
  Toyzone: { Manyavar: 3, Blaaze: 1, Suvidha: 4 },
  Blaaze: { Toyzone: 1, Suvidha: 3 },
  Suvidha: { Blaaze: 3, Toyzone: 4, "Home Centre": 2 },
  "Home Centre": { Suvidha: 2, "H&M": 5 },
  "Pixy Land": { "Blue Tokai": 1 },
};

// Dijkstra Algorithm
export function findShortestPath(start, end) {
  const distances = {};
  const visited = {};
  const previous = {};
  const nodes = Object.keys(mallGraph);

  nodes.forEach((node) => {
    distances[node] = Infinity;
    previous[node] = null;
  });

  distances[start] = 0;

  while (nodes.length) {
    nodes.sort((a, b) => distances[a] - distances[b]);
    const closest = nodes.shift();

    if (closest === end) break;
    if (!closest || distances[closest] === Infinity) break;

    for (let neighbor in mallGraph[closest]) {
      const newDistance =
        distances[closest] + mallGraph[closest][neighbor];

      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = closest;
      }
    }
  }

  const path = [];
  let current = end;

  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  return {
    distance: distances[end],
    path,
  };
}