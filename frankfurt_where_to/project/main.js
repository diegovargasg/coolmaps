import "./style.css";
import { Map, View } from "ol";
import { OSM, Vector as VectorSource } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import { Heatmap as HeatmapLayer, Vector as VectorLayer, Tile as TileLayer } from "ol/layer";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import geojsonObject from "../resources/frankfurt_shape/test.json" assert { type: "json" };
import heatSource from "../resources/frankfurt_shape/testTwo.json" assert { type: "json" };

import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";
import Colorize from "ol-ext/filter/Colorize";

const image = new CircleStyle({
  radius: 5,
  fill: null,
  stroke: new Stroke({color: 'red', width: 1}),
});

const styles = {
  'Point': new Style({
    image: image,
  }),
  'LineString': new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1,
    }),
  }),
  'MultiLineString': new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1,
    }),
  }),
  'MultiPoint': new Style({
    image: image,
  }),
  'MultiPolygon': new Style({
    stroke: new Stroke({
      color: 'yellow',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 0, 0.1)',
    }),
  }),
  'Polygon': new Style({
    stroke: new Stroke({
      color: 'blue',
      lineDash: [4],
      width: 3,
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)',
    }),
  }),
  'GeometryCollection': new Style({
    stroke: new Stroke({
      color: 'magenta',
      width: 2,
    }),
    fill: new Fill({
      color: 'magenta',
    }),
    image: new CircleStyle({
      radius: 10,
      fill: null,
      stroke: new Stroke({
        color: 'magenta',
      }),
    }),
  }),
  'Circle': new Style({
    stroke: new Stroke({
      color: 'red',
      width: 2,
    }),
    fill: new Fill({
      color: 'rgba(255,0,0,0.2)',
    }),
  }),
};

const styleFunction = function (feature) {
  return styles[feature.getGeometry().getType()];
};

const vectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(geojsonObject),
});

const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: styleFunction
});

const blur = document.getElementById('blur');
const radius = document.getElementById('radius');

const vectorHeat = new HeatmapLayer({
  source: new VectorSource({
    features: new GeoJSON().readFeatures(heatSource)
  }),
  blur: parseInt(blur.value, 10),
  radius: parseInt(radius.value, 10),
});


const OSMLayer = new TileLayer({
  source: new OSM(),
});

const map = new Map({
  target: "map",
  layers: [
    OSMLayer,
    vectorLayer,
    vectorHeat
  ],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

blur.addEventListener('input', function () {
  vectorHeat.setBlur(parseInt(blur.value, 10));
});

radius.addEventListener('input', function () {
  vectorHeat.setRadius(parseInt(radius.value, 10));
});

const color = new Colorize({ operation:'color', red: 218, green: 234,blue: 243});
OSMLayer.addFilter(color)
