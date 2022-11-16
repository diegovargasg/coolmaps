import "./style.css";
import { Map, View } from "ol";
import { OSM, Vector as VectorSource } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import { Heatmap as HeatmapLayer, Vector as VectorLayer, Tile as TileLayer } from "ol/layer";
import { Fill, Stroke, Style, Text } from "ol/style";
import cityShape from "../resources/frankfurt_shape/frankfurt_shape_3857.json" assert { type: "json" };
import amenitiesJSON from "../resources/amenities.json" assert { type: "json" };
import "ol-ext/dist/ol-ext.css";
import Colorize from "ol-ext/filter/Colorize";
import Overlay from "ol/Overlay";
import { ScaleLine } from "ol/control";

function changeZoom() {
  const mapSize = map.getSize();
  if (mapSize[0] < 576) {
    map.getView().setMinZoom(10);
    map.getView().setZoom(10);
  }
}

const container = document.getElementById("popup");
const content = document.getElementById("popup-content");
const closer = document.getElementById("popup-closer");
const amenities = document.getElementById("amenitiesOptions");

let optAmenities = "";
amenitiesJSON['data'].forEach((amenity) => {
  console.log(amenity)
  optAmenities += `<option value="${amenity.value}">`;
});
amenities.innerHTML = optAmenities;

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

// ScaleLine
const scaleLineControl = new ScaleLine();

// City Shape Layer
const cityVectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(cityShape),
});

const cityShapeStyle = new Style({
  stroke: new Stroke({
    color: "#112935",
    width: 2,
  }),
});

const cityVectorLayer = new VectorLayer({
  source: cityVectorSource,
  style: cityShapeStyle,
});

// Open Stree Maps Layer
const OSMLayer = new TileLayer({
  source: new OSM(),
});

// Map
const map = new Map({
  target: "map",
  layers: [OSMLayer, cityVectorLayer],
  overlays: [overlay],
  view: new View({
    center: [962681.9004039827, 6467250.616324813],
    zoom: 11,
    minZoom: 11,
    maxZoom: 17,
  }),
});

const color = new Colorize({ operation: "color", red: 218, green: 234, blue: 243 });
OSMLayer.addFilter(color);
map.addControl(scaleLineControl);

// Handles feature click
map.on("singleclick", function (event) {
  map.forEachFeatureAtPixel(
    event.pixel,
    (feature) => {
      const allProps = feature.getProperties();
      const keyToIgnore = ["id", "@id", "geometry", "@geometry"];
      let finalProps = "";

      for (const [key, value] of Object.entries(allProps)) {
        if (!keyToIgnore.includes(key) && value !== null) {
          finalProps += `<li><b>${key}:</b> ${value}</li>`;
        }
      }
      content.innerHTML = `<ul>${finalProps}</ul>`;
      const coordinates = feature.getGeometry().getFlatCoordinates();
      overlay.setPosition(coordinates);
      return feature;
    },
    {
      layerFilter: (layer) => {
        return layer === barsVectorLayer || layer === tableTennisVectorLayer;
      },
    },
  );
});

map.on("change:size", (event) => {
  changeZoom();
});

changeZoom();
