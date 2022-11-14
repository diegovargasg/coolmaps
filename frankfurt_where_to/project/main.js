import "./style.css";
import { Map, View } from "ol";
import { OSM, Vector as VectorSource } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import { Heatmap as HeatmapLayer, Vector as VectorLayer, Tile as TileLayer } from "ol/layer";
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import cityShape from "../resources/frankfurt_shape/frankfurt_shape_3857.json" assert { type: "json" };
import heatGeoJson from "../resources/frankfurt_tennis_bar_3857.json" assert { type: "json" };
import tableTennisGeoJson from "../resources/frankfurt_table_tennis_3857.json" assert { type: "json" };
import "ol-ext/dist/ol-ext.css";
import Colorize from "ol-ext/filter/Colorize";
import Overlay from 'ol/Overlay';

const image = new CircleStyle({
  radius: 5,
  fill: null,
  stroke: new Stroke({ color: "red", width: 1 }),
});

const cityShapeStyle = new Style({
  stroke: new Stroke({
    color: "#112935",
    width: 2,
  })
});

const blur = document.getElementById("blur");
const radius = document.getElementById("radius");

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

// Table Tennis Layer
const tableTennisVectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(tableTennisGeoJson),
});

const styleTableTennis = new Style({
  text: new Text({
    text: "\uf45d",
    font: '900 18px "Font Awesome 5 Free"',
    fill: new Fill({
      color: "#296483",
    }),
  }),
});

const tableTennisVectorLayer = new VectorLayer({
  source: tableTennisVectorSource,
  style: styleTableTennis,
  minZoom: 14
});

// City Shape Layer
const cityVectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(cityShape),
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
  blur: parseInt(blur.value, 10),
  radius: parseInt(radius.value, 10),
});

// Open Stree Maps Layer
const OSMLayer = new TileLayer({
  source: new OSM()
});

const styleBar = new Style({
  text: new Text({
    text: "\uf0fc",
    font: '900 18px "Font Awesome 5 Free"',
    fill: new Fill({
      color: "blue",
    }),
  }),
});

const feature = new Feature({
  geometry: new Point([968939.263738710898906, 6468889.594608341343701]),
});
feature.setStyle(styleBar);

cityVectorLayer.getSource().addFeature(feature);

const map = new Map({
  target: "map",
  layers: [OSMLayer, cityVectorLayer, heatLayer, tableTennisVectorLayer],
  overlays: [overlay],
  view: new View({
    center: [950087.313388021430001, 6456766.780438467860222],
    zoom: 11,
    minZoom: 11
  }),
});

blur.addEventListener("input", function () {
  console.log("blur", blur.value);
  heatLayer.setBlur(parseInt(blur.value, 10));
});

radius.addEventListener("input", function () {
  console.log("radius", radius.value);
  heatLayer.setRadius(parseInt(radius.value, 10));
});

const color = new Colorize({ operation: "color", red: 218, green: 234, blue: 243 });
OSMLayer.addFilter(color);

map.on('singleclick', function (event) {
  map.forEachFeatureAtPixel(event.pixel, (feature) => {
    content.innerHTML = '<p>You clicked here:</p><code></code>';
    const coordinates = feature.getGeometry().getFlatCoordinates();
    overlay.setPosition(coordinates);
    return feature;
  }, {
    layerFilter: (layer) => {
      return layer === tableTennisVectorLayer;
    }
  });
});
