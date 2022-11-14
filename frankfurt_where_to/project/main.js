import "./style.css";
import { Map, View } from "ol";
import { OSM, Vector as VectorSource } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import { Heatmap as HeatmapLayer, Vector as VectorLayer, Tile as TileLayer } from "ol/layer";
import { Fill, Stroke, Style, Text } from "ol/style";
import cityShape from "../resources/frankfurt_shape/frankfurt_shape_3857.json" assert { type: "json" };
import heatGeoJson from "../resources/frankfurt_tennis_bar_3857.json" assert { type: "json" };
import tableTennisGeoJson from "../resources/frankfurt_table_tennis_3857.json" assert { type: "json" };
import barTennisGeoJson from "../resources/frankfurt_bars_tennis_3857.json" assert { type: "json" };
import "ol-ext/dist/ol-ext.css";
import Colorize from "ol-ext/filter/Colorize";
import Overlay from 'ol/Overlay';

function changeZoom() {
  const mapSize = map.getSize();
  if(mapSize[0] < 576) {
    map.getView().setMinZoom(10);
    map.getView().setZoom(10);
  }
}

const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

// Bars Layer
const barsVectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(barTennisGeoJson)
})

const styleBars = new Style({
  text: new Text({
    text: "\uf0fc",
    font: '900 20px "Font Awesome 5 Free"',
    stroke: new Stroke({
      color: "#112935",
      width: 2.5,
    }),
    fill: new Fill({
      color: "#ffb703",
    }),
  }),
});

const barsVectorLayer = new VectorLayer({
  source: barsVectorSource,
  style: styleBars,
  minZoom: 13
});

// Table Tennis Layer
const tableTennisVectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(tableTennisGeoJson)
});

const styleTableTennis = new Style({
  text: new Text({
    text: "\uf45d",
    font: '900 18px "Font Awesome 5 Free"',
    stroke: new Stroke({
      color: "#fff",
      width: 2.5,
    }),
    fill: new Fill({
      color: "#296483",
    }),
  }),
});

const tableTennisVectorLayer = new VectorLayer({
  source: tableTennisVectorSource,
  style: styleTableTennis,
  minZoom: 13
});

// City Shape Layer
const cityVectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(cityShape),
});

const cityShapeStyle = new Style({
  stroke: new Stroke({
    color: "#112935",
    width: 2,
  })
});

const cityVectorLayer = new VectorLayer({
  source: cityVectorSource,
  style: cityShapeStyle,
});

// Heat Layer
const heatLayer = new HeatmapLayer({
  source: new VectorSource({
    features: new GeoJSON().readFeatures(heatGeoJson),
  }),
  opacity: 0.8,
  gradient: ['#1C8200', '#1C8200', '#1C8200', '#F0CA4D', '#E37B40', '#DE5B49'],
  blur: 16,
  radius: 8,
  maxZoom: 13
});

// Open Stree Maps Layer
const OSMLayer = new TileLayer({
  source: new OSM()
});

// Map
const map = new Map({
  target: "map",
  layers: [OSMLayer, cityVectorLayer, heatLayer, tableTennisVectorLayer, barsVectorLayer],
  overlays: [overlay],
  view: new View({
    center: [962681.9004039827, 6467250.616324813],
    zoom: 11,
    minZoom: 11,
    maxZoom: 17
  }),
});

const color = new Colorize({ operation: "color", red: 218, green: 234, blue: 243 });
OSMLayer.addFilter(color);

// Handles feature click
map.on('singleclick', function (event) {
  map.forEachFeatureAtPixel(event.pixel, (feature) => {
    const allProps = feature.getProperties();
    const keyToIgnore = ['id', '@id', 'geometry', '@geometry'];
    let finalProps = '';
    
    for (const [key, value] of Object.entries(allProps)) {
      if(!keyToIgnore.includes(key) && value !== null) {
        finalProps += `<li><b>${key}:</b> ${value}</li>`;
      }
    }
    content.innerHTML = `<ul>${finalProps}</ul>`;
    const coordinates = feature.getGeometry().getFlatCoordinates();
    overlay.setPosition(coordinates);
    return feature;
  }, {
    layerFilter: (layer) => {
      return layer === barsVectorLayer;
    }
  });
});

map.on('change:size', (event) => {
  changeZoom();
})

changeZoom();