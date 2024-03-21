console.log(mapToken);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  
  center: JSON.parse(coordinates), // starting position [lng, lat]
  zoom: 9, // starting zoom
});

console.log(typeof(coordinates));
const marker = new mapboxgl.Marker({color:"red"}).setLngLat(JSON.parse(coordinates)).addTo(map);